'use client'

import React from 'react'

import useMyCart from '@/hooks/useMyCart'
import { CartItem as CartItemType } from '@/types/cart.types'
import { Pagination } from '@/types/utils.types'

type CartContext = {
  totalAmount: number
  totalItems: number
  cartItems: CartItemType[]
  isLoadingCart: boolean
  paginationCart: Pagination
}

const initialContext: CartContext = {
  totalAmount: 0,
  totalItems: 0,
  cartItems: [],
  isLoadingCart: false,
  paginationCart: { page: 1, limit: 20, totalPages: 0, totalRows: 0 }
}

export const CartContext = React.createContext<CartContext>(initialContext)

export default function CartProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { totalAmount, cartItems, totalItems, getMyCartQuery } = useMyCart()

  const pagination = React.useMemo(
    () => getMyCartQuery.data?.data.data.pagination || initialContext.paginationCart,
    [getMyCartQuery.data?.data.data.pagination]
  )

  return (
    <CartContext.Provider
      value={{
        totalAmount,
        totalItems,
        cartItems,
        isLoadingCart: getMyCartQuery.isLoading,
        paginationCart: pagination
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
