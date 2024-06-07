import { useQuery } from '@tanstack/react-query'
import React from 'react'

import rolesApis from '@/apis/roles.apis'

export default function useAllRoles() {
  const getAllRolesQuery = useQuery({
    queryKey: ['getAllRoles'],
    queryFn: () => rolesApis.getAll()
  })

  const allRoles = React.useMemo(
    () => getAllRolesQuery.data?.data.data.roles || [],
    [getAllRolesQuery.data?.data.data.roles]
  )
  const totalRole = React.useMemo(
    () => getAllRolesQuery.data?.data.data.pagination.totalRows || 0,
    [getAllRolesQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getAllRolesQuery,
    allRoles,
    totalRole
  }
}
