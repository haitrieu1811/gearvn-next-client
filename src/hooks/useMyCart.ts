'use client'

import { useQuery } from '@tanstack/react-query'
import React from 'react'

import cartApis from '@/apis/cart.apis'
import { AppContext } from '@/providers/app.provider'

export default function useMyCart() {
  const { isAuthenticated } = React.useContext(AppContext)

  const getMyCartQuery = useQuery({
    queryKey: ['getMyCart', isAuthenticated],
    queryFn: () => cartApis.getMyCart(),
    enabled: isAuthenticated
  })

  const cartItems = React.useMemo(
    () => getMyCartQuery.data?.data.data.cartItems || [],
    [getMyCartQuery.data?.data.data.cartItems]
  )
  const totalItems = React.useMemo(
    () => getMyCartQuery.data?.data.data.totalItems || 0,
    [getMyCartQuery.data?.data.data.totalItems]
  )
  const totalAmount = React.useMemo(
    () => getMyCartQuery.data?.data.data.totalAmount || 0,
    [getMyCartQuery.data?.data.data.totalAmount]
  )

  return {
    cartItems,
    totalItems,
    totalAmount,
    getMyCartQuery
  }
}
