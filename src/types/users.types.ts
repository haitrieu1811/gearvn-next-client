import { Gender, UserStatus, UserType, UserVerifyStatus } from '@/constants/enum'

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

export type LoginReqBody = {
  email: string
  password: string
}
