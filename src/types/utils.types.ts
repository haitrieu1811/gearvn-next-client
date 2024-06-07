import { LoggedUser } from '@/types/users.types'

export type SuccessResponse<Data> = {
  message: string
  data: Data
}

export type ErrorResponse<Data> = {
  message: string
  errors: Data
}

export type OnlyMessageResponse = {
  message: string
}

export type AuthResponse = SuccessResponse<{
  accessToken: string
  refreshToken: string
  user: LoggedUser
}>

export type Pagination = {
  page: number
  limit: number
  totalRows: number
  totalPages: number
}

export type PaginationReqQuery = {
  page?: string
  limit?: string
}
