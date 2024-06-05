import axios, { AxiosInstance, HttpStatusCode, InternalAxiosRequestConfig } from 'axios'

import { LOGIN_URL, LOGOUT_URL, REFRESH_TOKEN_URL } from '@/apis/users.apis'
import {
  getAccessTokenFromLS,
  getLoggedUserFromLS,
  getRefreshTokenFromLS,
  resetAuthLS,
  setAccessTokenToLS,
  setLoggedUserToLS,
  setRefreshTokenToLS
} from '@/lib/auth'
import { LoggedUser } from '@/types/users.types'
import { AuthResponse, ErrorResponse } from '@/types/utils.types'
import { toast } from 'sonner'
import { isExpiredError, isUnauthorizedError } from '@/lib/utils'

class Http {
  instance: AxiosInstance
  private accessToken: string | null
  private refreshToken: string | null
  private loggedUser: LoggedUser | null
  private refreshTokenRequest: Promise<string> | null

  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.refreshToken = getRefreshTokenFromLS()
    this.loggedUser = getLoggedUserFromLS()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: process.env.NEXT_PUBLIC_SERVER_BASE_URL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = `Bearer ${this.accessToken}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url, method } = response.config
        if (url && method && [LOGIN_URL].includes(url) && ['patch', 'post'].includes(method)) {
          const { accessToken, refreshToken, user } = (response.data as AuthResponse).data
          this.accessToken = accessToken
          this.refreshToken = refreshToken
          this.loggedUser = user
          setAccessTokenToLS(accessToken)
          setRefreshTokenToLS(refreshToken)
          setLoggedUserToLS(user)
        }
        if (url === LOGOUT_URL) {
          this.accessToken = null
          this.refreshToken = null
          this.loggedUser = null
          resetAuthLS()
        }
        return response
      },
      async (error) => {
        if (![HttpStatusCode.UnprocessableEntity, HttpStatusCode.Unauthorized].includes(error.response?.status)) {
          const data: any | undefined = error.response.data
          const message = data?.message || error.message
          toast.error(message)
        }
        // Error 401 (Incorrect, missing or expired access token)
        if (isUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          // When the access token expires and there is no request from a refresh access token
          if (isExpiredError(error) && url && ![REFRESH_TOKEN_URL].includes(url)) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest?.then((accessToken) => {
              config.headers.Authorization = accessToken
              // Continue the old request if there is an error
              return this.instance({
                ...config,
                headers: { ...config.headers, Authorization: accessToken }
              })
            })
          }
          resetAuthLS()
          this.accessToken = null
          this.refreshToken = null
          this.loggedUser = null
          const errorMessage = error.response?.data.errors?.message || error.response?.data.message
          if (errorMessage) {
            toast.error(errorMessage)
          }
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken = async () => {
    return this.instance
      .post<AuthResponse>(REFRESH_TOKEN_URL, { refreshToken: this.refreshToken })
      .then((res) => {
        const { accessToken, refreshToken } = res.data.data
        setAccessTokenToLS(accessToken)
        setRefreshTokenToLS(refreshToken)
        this.accessToken = accessToken
        this.refreshToken = refreshToken
        return accessToken
      })
      .catch((error) => {
        resetAuthLS()
        this.accessToken = null
        this.refreshToken = null
        throw error
      })
  }
}

const http = new Http().instance
export default http
