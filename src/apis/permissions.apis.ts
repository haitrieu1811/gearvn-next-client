import http from '@/lib/http'
import { GetPermissionsResponse } from '@/types/permissions.types'
import { GetPermissionsGroupByUserResponse } from '@/types/roles.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const permissionsApis = {
  getPermissionsGroupByUser(params?: PaginationReqQuery) {
    return http.get<GetPermissionsGroupByUserResponse>('/v1/roles/permission/group-by-user', { params })
  },

  assignRoleForUser({ userId, roleId }: { userId: string; roleId: string }) {
    return http.post<OnlyMessageResponse>(`/v1/roles/${roleId}/assign/user/${userId}`)
  },

  unassignRoleOfUser({ userId, roleId }: { userId: string; roleId: string }) {
    return http.delete<OnlyMessageResponse>(`/v1/roles/${roleId}/unassign/user/${userId}`)
  },

  getPermissionsByUserId({ userId, params }: { userId: string; params?: PaginationReqQuery }) {
    return http.get<GetPermissionsResponse>(`/v1/roles/user/${userId}`, { params })
  }
} as const

export default permissionsApis
