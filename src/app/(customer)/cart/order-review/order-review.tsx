'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

import cartApis from '@/apis/cart.apis'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { PaymentMethod } from '@/constants/enum'
import PATH from '@/constants/path'
import { cn, formatCurrency } from '@/lib/utils'
import { CartContext } from '@/providers/cart.provider'
import { CheckoutContext } from '@/providers/checkout.provider'

const PAYMENT_METHOD = {
  [PaymentMethod.Cash]: 'Tiền mặt',
  [PaymentMethod.Banking]: 'Chuyển khoản qua nhân hàng.'
} as const

export default function OrderReview() {
  const router = useRouter()
  const queryClient = useQueryClient()

  const { cartItems, totalAmount, totalItems } = React.useContext(CartContext)
  const { note, paymentMethod, currentAddress } = React.useContext(CheckoutContext)

  const checkoutMutation = useMutation({
    mutationKey: ['checkout'],
    mutationFn: cartApis.checkout,
    onSuccess: () => {
      router.push(PATH.CART_ORDER_SUCCESS)
      queryClient.invalidateQueries({ queryKey: ['getMyCart'] })
    }
  })

  const handleCheckout = () => {
    if (!currentAddress) return
    const { fullName, phoneNumber, province, district, ward, street, detailAddress } = currentAddress
    checkoutMutation.mutate({
      fullName,
      phoneNumber,
      provinceId: province._id,
      districtId: district.id,
      wardId: ward.id,
      streetId: street.id,
      detailAddress,
      paymentMethod
    })
  }

  return (
    <React.Fragment>
      <div className='p-5 space-y-5'>
        <h3 className='font-semibold tracking-tight text-xl'>Thông tin đặt hàng</h3>
        <Table className='border'>
          <TableBody>
            <TableRow>
              <TableCell className='font-semibold'>Khách hàng:</TableCell>
              <TableCell>{currentAddress?.fullName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Số điện thoại:</TableCell>
              <TableCell>{currentAddress?.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Địa chỉ nhận hàng:</TableCell>
              <TableCell>
                {currentAddress?.detailAddress}, {currentAddress?.street.prefix} {currentAddress?.street.name},{' '}
                {currentAddress?.district.name}, {currentAddress?.province.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Phương thức thanh toán:</TableCell>
              <TableCell>{PAYMENT_METHOD[paymentMethod]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Ghi chú:</TableCell>
              <TableCell>{!!note ? note : 'Không có ghi chú'}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
      <div className='p-5 space-y-5'>
        <h3 className='font-semibold tracking-tight text-xl'>Thông tin sản phẩm mua</h3>
        <Table className='border'>
          <TableHeader>
            <TableRow>
              <TableHead>Sản phẩm</TableHead>
              <TableHead>Số lượng</TableHead>
              <TableHead>Đơn giá</TableHead>
              <TableHead>Thành tiền</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cartItems.map((cartItem) => (
              <TableRow key={cartItem._id}>
                <TableCell>
                  <div className='flex items-start space-x-2'>
                    <Link
                      href={PATH.PRODUCT_DETAIL({ name: cartItem.product.name, id: cartItem.product._id })}
                      className='flex-shrink-0'
                    >
                      <Image
                        width={50}
                        height={50}
                        src={cartItem.product.thumbnail}
                        alt={cartItem.product.name}
                        className='aspect-square object-cover rounded-md'
                      />
                    </Link>
                    <Link
                      href={PATH.PRODUCT_DETAIL({ name: cartItem.product.name, id: cartItem.product._id })}
                      className='hover:underline'
                    >
                      {cartItem.product.name}
                    </Link>
                  </div>
                </TableCell>
                <TableCell>{cartItem.quantity}</TableCell>
                <TableCell>{formatCurrency(cartItem.unitPrice)}&#8363;</TableCell>
                <TableCell>{formatCurrency(cartItem.quantity * cartItem.unitPrice)}&#8363;</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={2}>Tổng sản phẩm:</TableCell>
              <TableCell colSpan={2}>
                <div className='flex justify-end'>{totalItems} sản phẩm</div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Tổng tiền:</TableCell>
              <TableCell colSpan={2}>
                <div className='flex justify-end text-main font-semibold'>{formatCurrency(totalAmount)}&#8363;</div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <div className='p-5'>
        <div
          className={cn({
            'cursor-not-allowed': !currentAddress || checkoutMutation.isPending
          })}
        >
          <Button
            type='submit'
            disabled={!currentAddress || checkoutMutation.isPending}
            className='h-12 w-full uppercase bg-main hover:bg-main-foreground font-semibold text-base'
            onClick={handleCheckout}
          >
            {checkoutMutation.isPending && <Loader2 className='w-5 h-5 mr-2 animate-spin' />}
            Thanh toán ngay
          </Button>
        </div>
        {!currentAddress && (
          <p className='text-[0.8rem] text-destructive font-medium mt-2 text-center'>Chưa thêm địa chỉ nhận hàng</p>
        )}
      </div>
    </React.Fragment>
  )
}
