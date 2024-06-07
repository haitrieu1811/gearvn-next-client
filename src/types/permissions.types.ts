import { RoleField, RoleType } from '@/constants/enum'
import { Pagination, SuccessResponse } from '@/types/utils.types'

export type PermissionItem = {
  _id: string
  type: RoleType
  field: RoleField
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export type GetPermissionsResponse = SuccessResponse<{
  permissions: PermissionItem[]
  pagination: Pagination
}>
