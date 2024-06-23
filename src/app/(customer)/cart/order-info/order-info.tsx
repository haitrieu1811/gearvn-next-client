'use client'

import { MapPin } from 'lucide-react'
import Link from 'next/link'
import React, { useEffect } from 'react'
import { toast } from 'sonner'

import CreateAddressForm from '@/app/(customer)/_components/create-address-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { PaymentMethod } from '@/constants/enum'
import PATH from '@/constants/path'
import useMyAddresses from '@/hooks/useMyAddresses'
import { cn, formatCurrency } from '@/lib/utils'
import { CartContext } from '@/providers/cart.provider'
import { CheckoutContext } from '@/providers/checkout.provider'
import { AddressItem } from '@/types/addresses.types'

export default function OrderInfo() {
  const [isOpenCreateAddressDialog, setIsOpenCreateAddressDialog] = React.useState<boolean>(false)
  const [isOpenSelectAddressDialog, setIsOpenSelectAddressDialog] = React.useState<boolean>(false)

  const { totalAmount } = React.useContext(CartContext)
  const { currentAddress, setCurrentAddress, note, setNote, paymentMethod, setPaymentMethod } =
    React.useContext(CheckoutContext)

  const { myAddresses, totalMyAddreses, getMyAddressesQuery } = useMyAddresses()

  const handleChangeAddress = (address: AddressItem) => {
    setCurrentAddress(address)
    setIsOpenSelectAddressDialog(false)
    toast.success('Thay đổi địa chỉ nhận hàng thành công.')
  }

  // SET DEFAULT ADDRESS
  useEffect(() => {
    const defaultAddress = myAddresses.find((address) => address.isDefaultAddress)
    if (!defaultAddress) return
    setCurrentAddress(defaultAddress)
  }, [myAddresses, setCurrentAddress])

  return (
    <div className='p-5'>
      {/* ADDRESS */}
      <div className='space-y-3'>
        <div className='flex justify-between items-center'>
          <div className='flex items-center text-main font-semibold'>
            <MapPin size={18} className='mr-2' />
            Địa chỉ nhận hàng
          </div>
          {totalMyAddreses > 0 && (
            <Button variant='link' className='text-blue-500' onClick={() => setIsOpenSelectAddressDialog(true)}>
              {!!currentAddress ? 'Thay đổi' : 'Chọn địa chỉ của tôi'}
            </Button>
          )}
          {totalMyAddreses === 0 && (
            <Button variant='link' className='text-blue-500' onClick={() => setIsOpenCreateAddressDialog(true)}>
              Thêm địa chỉ nhận hàng
            </Button>
          )}
        </div>
        {totalMyAddreses > 0 && !!currentAddress && (
          <div className='space-y-2'>
            <div className='flex items-center space-x-2 font-medium text-sm'>
              <div>{currentAddress.fullName}</div>
              <Separator className='w-px h-4' />
              <div>{currentAddress.phoneNumber}</div>
            </div>
            <div className='text-sm text-muted-foreground'>
              {currentAddress.detailAddress}, {currentAddress.ward.prefix} {currentAddress.ward.name},{' '}
              {currentAddress.district.name}, {currentAddress.province.name}
            </div>
          </div>
        )}
        {totalMyAddreses > 0 && !currentAddress && (
          <div className='text-sm text-muted-foreground'>Chưa chọn địa chỉ nhận hàng.</div>
        )}
        {totalMyAddreses === 0 && (
          <div className='text-sm text-muted-foreground'>Bạn chưa có địa chỉ nhận hàng nào.</div>
        )}
      </div>
      <div className='mt-10 space-y-8'>
        <div className='space-y-2'>
          <Label>Ghi chú</Label>
          <Input
            placeholder='Lưu ý, yêu cầu khác (Không bắt buộc)'
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </div>
        <div className='space-y-2'>
          <Label>Phương thức thanh toán</Label>
          <RadioGroup
            defaultValue={paymentMethod.toString()}
            onValueChange={(value) => setPaymentMethod(Number(value))}
          >
            {[
              {
                value: PaymentMethod.Cash.toString(),
                label: 'Tiền mặt'
              },
              {
                value: PaymentMethod.Banking.toString(),
                label: 'Chuyển khoản'
              }
            ].map((item) => (
              <div key={item.value} className='flex items-center space-x-2'>
                <RadioGroupItem value={item.value} id={item.value} />
                <Label htmlFor={item.value}>{item.label}</Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div>
          <div className='flex justify-between items-center border-t py-5'>
            <div className='font-semibold'>Tổng tiền:</div>
            <div className='text-main font-semibold text-xl'>{formatCurrency(totalAmount)}&#8363;</div>
          </div>
          <div>
            <Button
              asChild
              type='button'
              // disabled={!currentAddress}
              disabled
              className='w-full h-12 bg-main hover:bg-main-foreground uppercase font-semibold text-base'
            >
              <Link href={PATH.CART_ORDER_REVIEW}>Đặt hàng ngay</Link>
            </Button>
          </div>
        </div>
      </div>
      {/* CREATE ADDRESS DIALOG */}
      <Dialog open={isOpenCreateAddressDialog} onOpenChange={(value) => setIsOpenCreateAddressDialog(value)}>
        <DialogContent className='max-h-screen overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          </DialogHeader>
          <CreateAddressForm
            onCreateSuccess={() => {
              setIsOpenCreateAddressDialog(false)
              getMyAddressesQuery.refetch()
            }}
          />
        </DialogContent>
      </Dialog>
      {/* SELECT ADDRESS DIALOG */}
      <Dialog open={isOpenSelectAddressDialog} onOpenChange={(value) => setIsOpenSelectAddressDialog(value)}>
        <DialogContent className='max-h-screen overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Chọn địa chỉ</DialogTitle>
            <DialogDescription>
              Để không phải chọn lại địa chỉ nhiều lần, bạn hãy chọn một địa chỉ thành mặc định ở{' '}
              <Button asChild variant='link' className='p-0 h-auto'>
                <Link href={PATH.ACCOUNT_ADDRESS}>trang quản lý địa chỉ</Link>
              </Button>
              .
            </DialogDescription>
          </DialogHeader>
          <div className='mt-5 space-y-2'>
            {myAddresses.map((address) => {
              const isSelected = address._id === currentAddress?._id
              return (
                <div
                  key={address._id}
                  className={cn('space-y-2 border-[2px] rounded-md p-4 hover:cursor-pointer', {
                    'border-border bg-transparent': !isSelected,
                    'border-main bg-rose-50': isSelected
                  })}
                  onClick={() => handleChangeAddress(address)}
                >
                  <div
                    className={cn('flex items-center space-x-3 text-sm font-medium', {
                      'text-main': isSelected
                    })}
                  >
                    <div>{address.fullName}</div>
                    <Separator className='w-px h-5' />
                    <div>{address.phoneNumber}</div>
                  </div>
                  <div
                    className={cn('text-sm', {
                      'text-muted-foreground': !isSelected,
                      'text-main': isSelected
                    })}
                  >
                    {address.detailAddress}, {address.ward.prefix} {address.ward.name}, {address.district.name},{' '}
                    {address.province.name}
                  </div>
                </div>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
