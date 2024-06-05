import axios, { AxiosInstance } from 'axios'

import { LOGIN_URL, LOGOUT_URL } from '@/apis/users.apis'
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
import { AuthResponse } from '@/types/utils.types'

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
      (error) => {
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
