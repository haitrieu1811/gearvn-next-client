import { useQuery } from '@tanstack/react-query'
import React from 'react'

import cartApis from '@/apis/cart.apis'

export default function useMyCart() {
  const getMycartQuery = useQuery({
    queryKey: ['getMyCart'],
    queryFn: () => cartApis.getMyCart()
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
