'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'

import cartApis from '@/apis/cart.apis'
import { AppContext } from '@/providers/app.provider'

export default function useMyCart() {
  const { isAuthenticated } = React.useContext(AppContext)

  const getMycartQuery = useQuery({
    queryKey: ['getMyCart'],
    queryFn: () => cartApis.getMyCart(),
    enabled: isAuthenticated
  })

  const cartItems = React.useMemo(
    () => getMycartQuery.data?.data.data.cartItems || [],
    [getMycartQuery.data?.data.data.cartItems]
  )
  const totalItems = React.useMemo(
    () => getMycartQuery.data?.data.data.totalItems || 0,
    [getMycartQuery.data?.data.data.totalItems]
  )
  const totalAmount = React.useMemo(
    () => getMycartQuery.data?.data.data.totalAmount || 0,
    [getMycartQuery.data?.data.data.totalAmount]
  )

  return {
    cartItems,
    totalItems,
    totalAmount,
    getMycartQuery
  }
}
