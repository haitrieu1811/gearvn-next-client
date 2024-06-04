import http from '@/lib/http'
import { LoginReqBody } from '@/types/users.types'
import { AuthResponse } from '@/types/utils.types'

export const LOGIN_URL = '/v1/users/login'

const usersApis = {
  login(body: LoginReqBody) {
    return http.post<AuthResponse>(LOGIN_URL, body)
  }
} as const

export default usersApis
