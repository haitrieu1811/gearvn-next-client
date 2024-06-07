import { useQuery } from '@tanstack/react-query'
import React from 'react'

import usersApis from '@/apis/users.apis'
import { GetAllUsersReqQuery } from '@/types/users.types'

export default function useAllUsers({ gender, status, type, verify }: GetAllUsersReqQuery) {
  const getAllUsersQuery = useQuery({
    queryKey: ['getAllUsers', { gender, status, type, verify }],
    queryFn: () => usersApis.getAllUsers({ gender, status, type, verify })
  })

  const allUsers = React.useMemo(
    () => getAllUsersQuery.data?.data.data.users || [],
    [getAllUsersQuery.data?.data.data.users]
  )
  const analytics = React.useMemo(
    () => getAllUsersQuery.data?.data.data.analytics,
    [getAllUsersQuery.data?.data.data.analytics]
  )

  return {
    getAllUsersQuery,
    allUsers,
    analytics
  }
}
