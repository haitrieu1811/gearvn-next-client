'use client'

import moment from 'moment'
import Link from 'next/link'

import OrderDetail from '@/components/order-detail'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { OrderStatus } from '@/constants/enum'
import PATH from '@/constants/path'
import useOrder from '@/hooks/useOrder'
import { convertMomentToVietnamese } from '@/lib/utils'

const ORDER_STATUS = {
  [OrderStatus.InCart]: '',
  [OrderStatus.WaitForConfirmation]: <div className='text-yellow-500 text-xl'>Chờ xác nhận</div>,
  [OrderStatus.Confirmed]: <div className='text-blue-500 text-xl'>Đã xác nhận</div>,
  [OrderStatus.Delivering]: <div className='text-yellow-500 text-xl'>Đang giao</div>,
  [OrderStatus.Delivered]: <div className='text-green-500 text-xl'>Đã giao</div>,
  [OrderStatus.Cancelled]: <div className='text-red-500 text-xl'>Đã hủy</div>
} as const

type OrderDetailProps = {
  orderId: string
}

export default function AccountOrderDetail({ orderId }: OrderDetailProps) {
  const { order } = useOrder({ orderId })
  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl flex items-center space-x-2'>
          <span>Chi tiết đơn hàng -</span> {order?.status && ORDER_STATUS[order.status]}
        </CardTitle>
      </CardHeader>
      <CardContent>{!!order && <OrderDetail orderData={order} />}</CardContent>
      <CardFooter className='justify-center'>
        <Button asChild size='lg' className='bg-blue-500 hover:bg-blue-600'>
          <Link href={PATH.ACCOUNT_ORDER}>Quay lại danh sách đơn hàng</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
