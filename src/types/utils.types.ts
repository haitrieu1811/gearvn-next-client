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

export const defaultPagination: Pagination = {
  page: 1,
  limit: 20,
  totalRows: 0,
  totalPages: 0
}

export type PaginationReqQuery = {
  page?: string
  limit?: string
}
