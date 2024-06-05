import http from '@/lib/http'
import { LoginReqBody } from '@/types/users.types'
import { AuthResponse, OnlyMessageResponse } from '@/types/utils.types'

export const LOGIN_URL = '/v1/users/login'
export const LOGOUT_URL = '/v1/users/logout'

const usersApis = {
  login(body: LoginReqBody) {
    return http.post<AuthResponse>(LOGIN_URL, body)
  },

  logout(refreshToken: string) {
    return http.post<OnlyMessageResponse>(LOGOUT_URL, { refreshToken })
  }
} as const

export default usersApis
