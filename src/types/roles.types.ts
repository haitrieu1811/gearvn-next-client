import { Gender, RoleField, RoleType, UserStatus, UserType, UserVerifyStatus } from '@/constants/enum'
import { Pagination, SuccessResponse } from '@/types/utils.types'

export type RoleItem = {
  _id: string
  type: RoleType
  field: RoleField
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type PermissionGroupByUser = {
  _id: string
  email: string
  fullName: string
  avatar: string
  type: UserType
  gender: Gender
  phoneNumber: string
  status: UserStatus
  verify: UserVerifyStatus
  roles: {
    _id: string
    name: string
    description: string
    createdAt: string
    updatedAt: string
  }[]
}

export type CreateRoleReqBody = {
  type: RoleType
  field: RoleField
  name: string
  description?: string
}

export type UpdateRoleReqBody = Partial<CreateRoleReqBody>

export type GetAllRolesResponse = SuccessResponse<{
  roles: RoleItem[]
  pagination: Pagination
}>

export type CreateRoleResponse = SuccessResponse<{
  role: RoleItem
}>

export type GetRoleResponse = SuccessResponse<{
  role: RoleItem
}>

export type UpdateRoleResponse = SuccessResponse<{
  role: RoleItem
}>

export type GetPermissionsGroupByUserResponse = SuccessResponse<{
  permissions: PermissionGroupByUser[]
  pagination: Pagination
}>
