'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BadgeInfo, ChevronLeft, CreditCard, Loader2, ShieldCheck, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import cartApis from '@/apis/cart.apis'
import CartItem from '@/components/cart-item'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import isAuth from '@/hocs/isAuth'
import useMyCart from '@/hooks/useMyCart'
import { cn, formatCurrency } from '@/lib/utils'

const STEPS = [
  {
    icon: ShoppingBag,
    name: 'Giỏ hàng'
  },
  {
    icon: BadgeInfo,
    name: 'Thông tin đặt hàng'
  },
  {
    icon: CreditCard,
    name: 'Thanh toán'
  },
  {
    icon: ShieldCheck,
    name: 'Hoàn tất'
  }
] as const

export default isAuth(function Cart() {
  const queryClient = useQueryClient()

  const { cartItems, totalAmount, totalItems } = useMyCart()

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
    <div className='py-5'>
      <div className='w-[600px] mx-auto space-y-2'>
        <Button asChild variant='ghost'>
          <Link href={PATH.PRODUCT} className='text-blue-500 hover:text-blue-600'>
            <ChevronLeft className='w-4 h-4 mr-2' />
            Mua thêm sản phẩm khác
          </Link>
        </Button>
        <div className='bg-background rounded-md shadow-sm p-2'>
          {/* STEPS */}
          <div className='flex bg-rose-50 p-5 rounded-md'>
            {STEPS.map((step, index) => {
              const isActive = index === 0
              return (
                <div
                  key={step.name}
                  className='flex-auto flex flex-col justify-center items-center space-y-1 relative before:absolute before:top-3.5 before:left-0 before:right-0 before:h-px before:bg-muted-foreground'
                >
                  <div
                    className={cn('w-7 h-7 rounded-full flex justify-center items-center border relative z-[1]', {
                      'bg-main border-main': isActive,
                      'bg-rose-50 border-muted-foreground': !isActive
                    })}
                  >
                    <step.icon
                      size={16}
                      className={cn({
                        'fill-white stroke-main': isActive,
                        'fill-rose-50 stroke-muted-foreground': !isActive
                      })}
                    />
                  </div>
                  <div
                    className={cn('text-sm', {
                      'text-main': isActive,
                      'text-muted-foreground': !isActive
                    })}
                  >
                    {step.name}
                  </div>
                </div>
              )
            })}
          </div>
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
                  <Button className='w-full h-12 bg-main hover:bg-main-foreground uppercase font-semibold text-base'>
                    {false && <Loader2 className='w-5 h-5 mr-2 animate-spin' />}
                    Đặt hàng ngay
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
        </div>
      </div>
    </div>
  )
})
