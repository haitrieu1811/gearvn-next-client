import { LoggedUser } from '@/types/users.types'

export type SuccessResponse<Data> = {
  message: string
  data: Data
}

export type ErrorResponse<Data> = {
  message: string
  errors: Data
}

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  user: LoggedUser
}>
