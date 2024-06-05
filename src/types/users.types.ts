import { Gender, UserStatus, UserType, UserVerifyStatus } from '@/constants/enum'
import { Pagination, SuccessResponse } from '@/types/utils.types'

export type LoggedUser = {
  _id: string
  email: string
  fullName: string
  avatar: string
  type: UserType
  gender: Gender
  status: UserStatus
  verify: UserVerifyStatus
  createdAt: string
  updatedAt: string
}

export type UserItem = {
  _id: string
  email: string
  fullName: string
  avatar: string
  phoneNumber: string
  type: UserType
  gender: Gender
  status: UserStatus
  verify: UserVerifyStatus
  createdAt: string
  updatedAt: string
}

export type LoginReqBody = {
  email: string
  password: string
}

export type GetAllUsersReqQuery = {
  type?: UserType
  gender?: Gender
  status?: UserStatus
  verify?: UserVerifyStatus
}

export type GetAllUsersResponse = SuccessResponse<{
  users: UserItem[]
  analytics: {
    totalUsers: number
    totalAdmin: number
    totalStaff: number
    totalCustomer: number
    totalMale: number
    totalFemale: number
    totalActive: number
    totalInactive: number
    totalVerified: number
    totalUnverified: number
  }
  pagination: Pagination
}>
