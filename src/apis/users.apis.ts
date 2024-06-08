import http from '@/lib/http'
import { CreateUserReqBody, GetAllUsersReqQuery, GetAllUsersResponse, LoginReqBody } from '@/types/users.types'
import { AuthResponse, OnlyMessageResponse } from '@/types/utils.types'

export const LOGIN_URL = '/v1/users/login'
export const LOGOUT_URL = '/v1/users/logout'
export const REFRESH_TOKEN_URL = '/v1/users/refresh-token'

const usersApis = {
  login(body: LoginReqBody) {
    return http.post<AuthResponse>(LOGIN_URL, body)
  },

  logout(refreshToken: string) {
    return http.post<OnlyMessageResponse>(LOGOUT_URL, { refreshToken })
  },

  getAllUsers(params?: GetAllUsersReqQuery) {
    return http.get<GetAllUsersResponse>('/v1/users/all', { params })
  },

  createUser(body: CreateUserReqBody) {
    return http.post<GetAllUsersResponse>('/v1/users', body)
  }
} as const

export default usersApis
