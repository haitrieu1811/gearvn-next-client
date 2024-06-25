'use client'

import { useQuery } from '@tanstack/react-query'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import ordersApis from '@/apis/orders.apis'
import { PAYMENT_METHOD } from '@/app/(customer)/cart/order-review/order-review'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { OrderStatus } from '@/constants/enum'
import PATH from '@/constants/path'
import { convertMomentToVietnamese, formatCurrency } from '@/lib/utils'

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

export default function OrderDetail({ orderId }: OrderDetailProps) {
  const getOrderDetailQuery = useQuery({
    queryKey: ['getOrderDetail'],
    queryFn: () => ordersApis.getOrderDetail(orderId)
  })

  const order = React.useMemo(
    () => getOrderDetailQuery.data?.data.data.order,
    [getOrderDetailQuery.data?.data.data.order]
  )

  return (
    <Card>
      <CardHeader className='flex-row justify-between space-y-0'>
        <CardTitle className='text-2xl flex items-center space-x-2'>
          <span>Chi tiết đơn hàng -</span> {order?.status && ORDER_STATUS[order.status]}
        </CardTitle>
        <div className='text-sm'>
          Đặt lúc: {moment(order?.createdAt).format('DD-MM-YYYY')} (
          {convertMomentToVietnamese(moment(order?.createdAt).fromNow())})
        </div>
      </CardHeader>
      <CardContent>
        <div className='py-5 space-y-5'>
          <h3 className='font-semibold tracking-tight text-xl'>Thông tin đặt hàng</h3>
          <Table className='border'>
            <TableBody>
              <TableRow>
                <TableCell className='font-semibold'>Khách hàng:</TableCell>
                <TableCell>{order?.fullName}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-semibold'>Số điện thoại:</TableCell>
                <TableCell>{order?.phoneNumber}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-semibold'>Địa chỉ nhận hàng:</TableCell>
                <TableCell>
                  {order?.detailAddress}, {order?.district.name}, {order?.province.name}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-semibold'>Phương thức thanh toán:</TableCell>
                <TableCell>{PAYMENT_METHOD[order?.paymentMethod || 0]}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell className='font-semibold'>Ghi chú:</TableCell>
                <TableCell>{!!order?.note ? order.note : 'Không có ghi chú'}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <div className='py-5 space-y-5'>
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
              {order?.cartItems.map((cartItem) => (
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
                  <div className='flex justify-end'>{order?.totalItems} sản phẩm</div>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={2}>Tổng tiền:</TableCell>
                <TableCell colSpan={2}>
                  <div className='flex justify-end text-main font-semibold'>
                    {formatCurrency(order?.totalAmount || 0)}&#8363;
                  </div>
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
      <CardFooter className='justify-center'>
        <Button asChild size='lg' className='bg-blue-500 hover:bg-blue-600'>
          <Link href={PATH.ACCOUNT_ORDER}>Quay lại danh sách đơn hàng</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
