import http from '@/lib/http'
import {
  CreateRoleReqBody,
  CreateRoleResponse,
  GetAllRolesResponse,
  GetPermissionsGroupByUserResponse,
  GetRoleResponse,
  UpdateRoleReqBody,
  UpdateRoleResponse
} from '@/types/roles.types'
import { PaginationReqQuery } from '@/types/utils.types'

const rolesApis = {
  getAll(params?: PaginationReqQuery) {
    return http.get<GetAllRolesResponse>('/v1/roles/all', { params })
  },

  create(body: CreateRoleReqBody) {
    return http.post<CreateRoleResponse>('/v1/roles', body)
  },

  findOne(roleId: string) {
    return http.get<GetRoleResponse>(`/v1/roles/${roleId}`)
  },

  update({ body, roleId }: { body: UpdateRoleReqBody; roleId: string }) {
    return http.patch<UpdateRoleResponse>(`/v1/roles/${roleId}`, body)
  }
} as const

export default rolesApis
