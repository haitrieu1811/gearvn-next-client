'use client'

import { useMutation } from '@tanstack/react-query'
import React from 'react'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import { getRefreshTokenFromLS } from '@/lib/auth'
import { AppContext } from '@/providers/app.provider'

export default function useLogout() {
  const { setIsAuthenticated, setLoggedUser } = React.useContext(AppContext)

  const logoutMutation = useMutation({
    mutationKey: ['logout'],
    mutationFn: usersApis.logout,
    onSuccess: async (data) => {
      toast.success(data.data.message)
      setIsAuthenticated(false)
      setLoggedUser(null)
      await fetch('/api/auth/logout', {
        method: 'POST',
        body: JSON.stringify({})
      })
    }
  })

  const handleLogout = () => {
    const refreshToken = getRefreshTokenFromLS()
    if (refreshToken) logoutMutation.mutate(refreshToken)
  }

  return {
    logoutMutation,
    handleLogout
  }
}
