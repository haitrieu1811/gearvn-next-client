import http from '@/lib/http'
import {
  CreateUserReqBody,
  GetAllUsersReqQuery,
  GetAllUsersResponse,
  GetMeResponse,
  LoginReqBody,
  RegisterReqBody,
  UpdateMeReqBody,
  UpdateMeResponse
} from '@/types/users.types'
import { AuthResponse, OnlyMessageResponse } from '@/types/utils.types'

export const LOGIN_URL = '/v1/users/login'
export const REGISTER_URL = '/v1/users/register'
export const LOGOUT_URL = '/v1/users/logout'
export const REFRESH_TOKEN_URL = '/v1/users/refresh-token'
export const UPDATE_ME_URL = '/v1/users/me'
export const VERIFY_EMAIL_URL = '/v1/users/verify-email'

const usersApis = {
  login(body: LoginReqBody) {
    return http.post<AuthResponse>(LOGIN_URL, body)
  },

  register(body: RegisterReqBody) {
    return http.post<AuthResponse>(REGISTER_URL, body)
  },

  logout(refreshToken: string) {
    return http.post<OnlyMessageResponse>(LOGOUT_URL, { refreshToken })
  },

  getAllUsers(params?: GetAllUsersReqQuery) {
    return http.get<GetAllUsersResponse>('/v1/users/all', { params })
  },

  createUser(body: CreateUserReqBody) {
    return http.post<GetAllUsersResponse>('/v1/users', body)
  },

  getMe() {
    return http.get<GetMeResponse>('/v1/users/me')
  },

  updateMe(body: UpdateMeReqBody) {
    return http.patch<UpdateMeResponse>(UPDATE_ME_URL, body)
  },

  verifyEmail(verifyEmailToken: string) {
    return http.post<AuthResponse>(VERIFY_EMAIL_URL, { verifyEmailToken })
  },

  resendEmailVerify() {
    return http.post<OnlyMessageResponse>('/v1/users/resend-email-verify')
  }
} as const

export default usersApis
