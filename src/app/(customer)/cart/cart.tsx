'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import cartApis from '@/apis/cart.apis'
import CartItem from '@/components/cart-item'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { formatCurrency } from '@/lib/utils'
import { CartContext } from '@/providers/cart.provider'

export default function Cart() {
  const queryClient = useQueryClient()

  const { cartItems, totalAmount, totalItems } = React.useContext(CartContext)

  const updateCartItemMutation = useMutation({
    mutationKey: ['updateCartItem'],
    mutationFn: cartApis.updateCartItem,
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['getMyCart'] })
    }
  })

  const deleteCartItemMutation = useMutation({
    mutationKey: ['deleteCartItem'],
    mutationFn: cartApis.deleteCartItem,
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['getMyCart'] })
    }
  })

  const handleUpdateCartItem = React.useCallback(
    ({ cartItemId, quantity }: { cartItemId: string; quantity: number }) => {
      updateCartItemMutation.mutate({ cartItemId, quantity })
    },
    [updateCartItemMutation]
  )

  const handleDeleteCartItem = React.useCallback(
    (cartItemId: string) => {
      deleteCartItemMutation.mutate(cartItemId)
    },
    [deleteCartItemMutation]
  )

  return (
    <React.Fragment>
      {totalItems > 0 && (
        <React.Fragment>
          {/* CART ITEMS */}
          <div>
            {cartItems.map((cartItem) => (
              <CartItem
                key={cartItem._id}
                cartItemData={cartItem}
                isPending={updateCartItemMutation.isPending}
                handleUpdateCartItem={handleUpdateCartItem}
                handleDeleteCartItem={handleDeleteCartItem}
              />
            ))}
          </div>
          {/* TOTAL */}
          <div>
            <div className='flex justify-between items-center border-t p-5'>
              <div className='font-semibold'>Tổng tiền:</div>
              <div className='text-main font-semibold text-xl'>{formatCurrency(totalAmount)}&#8363;</div>
            </div>
            <div className='p-5 pt-0'>
              <Button
                asChild
                className='w-full h-12 bg-main hover:bg-main-foreground uppercase font-semibold text-base'
              >
                <Link href={PATH.CART_ORDER_INFO}>Đặt hàng ngay</Link>
              </Button>
            </div>
          </div>
        </React.Fragment>
      )}
      {/* EMPTY CART */}
      {totalItems === 0 && (
        <div className='flex flex-col items-center space-y-3 py-10'>
          <div className='text-sm'>Giỏ hàng của bạn đang trống</div>
          <Button
            asChild
            variant='outline'
            className='uppercase rounded font-semibold text-blue-600 hover:text-blue-600 border-blue-600 hover:bg-blue-600/5'
          >
            <Link href={PATH.PRODUCT}>Tiếp tục mua hàng</Link>
          </Button>
        </div>
      )}
    </React.Fragment>
  )
}
