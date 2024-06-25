'use client'

import { useQuery } from '@tanstack/react-query'
import { CheckCircle, Clock, Loader, Loader2, PackageCheck, PackageOpen, Truck, XCircle } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import ordersApis from '@/apis/orders.apis'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { OrderStatus } from '@/constants/enum'
import PATH from '@/constants/path'
import { convertMomentToVietnamese, formatCurrency } from '@/lib/utils'

const ORDER_STATUS = {
  [OrderStatus.InCart]: <div />,
  [OrderStatus.WaitForConfirmation]: (
    <div className='flex items-center font-semibold text-yellow-500'>
      <Loader size={16} className='mr-2' />
      Chờ xác nhận
    </div>
  ),
  [OrderStatus.Confirmed]: (
    <div className='flex items-center font-semibold text-blue-500'>
      <PackageCheck size={16} className='mr-2' />
      Đã xác nhận
    </div>
  ),
  [OrderStatus.Delivering]: (
    <div className='flex items-center font-semibold text-blue-500'>
      <Truck size={16} className='mr-2' />
      Đang vận chuyển
    </div>
  ),
  [OrderStatus.Delivered]: (
    <div className='flex items-center font-semibold text-green-500'>
      <CheckCircle size={16} className='mr-2' />
      Đã giao
    </div>
  ),
  [OrderStatus.Cancelled]: (
    <div className='flex items-center font-semibold text-red-500'>
      <XCircle size={16} className='mr-2' />
      Đã hủy
    </div>
  )
} as const

export default function AccountOrder() {
  const getMyOrdersQuery = useQuery({
    queryKey: ['getMyOrders'],
    queryFn: () => ordersApis.getMyOrders()
  })

  const orders = React.useMemo(
    () => getMyOrdersQuery.data?.data.data.orders || [],
    [getMyOrdersQuery.data?.data.data.orders]
  )
  const totalOrder = React.useMemo(
    () => getMyOrdersQuery.data?.data.data.pagination.totalRows || 0,
    [getMyOrdersQuery.data?.data.data.pagination.totalRows]
  )

  const orderData = React.useMemo(
    () => [
      {
        field: 'Tất cả',
        value: 'all',
        quantity: totalOrder,
        orders
      },
      {
        field: 'Chờ xác nhận',
        value: 'waitForConfirmation',
        quantity: orders.filter((order) => order.status === OrderStatus.WaitForConfirmation).length,
        orders: orders.filter((order) => order.status === OrderStatus.WaitForConfirmation)
      },
      {
        field: 'Đã xác nhận',
        value: 'confirmed',
        quantity: orders.filter((order) => order.status === OrderStatus.Confirmed).length,
        orders: orders.filter((order) => order.status === OrderStatus.Confirmed)
      },
      {
        field: 'Đang giao',
        value: 'delivering',
        quantity: orders.filter((order) => order.status === OrderStatus.Delivering).length,
        orders: orders.filter((order) => order.status === OrderStatus.Delivering)
      },
      {
        field: 'Đã giao',
        value: 'delivered',
        quantity: orders.filter((order) => order.status === OrderStatus.Delivered).length,
        orders: orders.filter((order) => order.status === OrderStatus.Delivered)
      },
      {
        field: 'Đã hủy',
        value: 'Cancelled',
        quantity: orders.filter((order) => order.status === OrderStatus.Cancelled).length,
        orders: orders.filter((order) => order.status === OrderStatus.Cancelled)
      }
    ],
    [orders, totalOrder]
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Quản lý đơn hàng</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={orderData[0].value}>
          <TabsList>
            {orderData.map((item) => (
              <TabsTrigger key={item.value} value={item.value}>
                {item.field}
                <span className='text-xs ml-2'>({item.quantity})</span>
              </TabsTrigger>
            ))}
          </TabsList>
          {orderData.map((item) => (
            <TabsContent key={item.value} value={item.value} className='space-y-10 pt-5'>
              {/* LOADING */}
              {getMyOrdersQuery.isLoading && (
                <div className='flex justify-center items-center py-10'>
                  <Loader2 size={50} strokeWidth={1} className='animate-spin text-main' />
                </div>
              )}
              {/* ORDERS LIST */}
              {item.orders.length > 0 &&
                !getMyOrdersQuery.isLoading &&
                item.orders.map((order) => (
                  <div key={order._id} className='border rounded-md'>
                    <div className='flex justify-between items-center text-sm p-4 border-b'>
                      {ORDER_STATUS[order.status]}
                      <div className='flex items-center text-muted-foreground'>
                        <Clock size={16} className='mr-2' />
                        {convertMomentToVietnamese(moment(order.createdAt).fromNow())}
                      </div>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Sản phẩm</TableHead>
                          <TableHead>Số lượng</TableHead>
                          <TableHead>Đơn giá</TableHead>
                          <TableHead>Thành tiền</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {order.cartItems.map((cartItem) => (
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
                            <div className='flex justify-end'>{order.totalItems} sản phẩm</div>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell colSpan={2}>Tổng tiền:</TableCell>
                          <TableCell colSpan={2}>
                            <div className='flex justify-end text-main font-semibold'>
                              {formatCurrency(order.totalAmount)}&#8363;
                            </div>
                          </TableCell>
                        </TableRow>
                      </TableFooter>
                    </Table>
                    <div className='p-4 flex justify-end border-t'>
                      <Button
                        asChild
                        variant='outline'
                        className='border-blue-600 text-blue-600 hover:text-blue-600 hover:bg-blue-50'
                      >
                        <Link href={PATH.ORDER_DETAIL(order._id)}>Xem chi tiết</Link>
                      </Button>
                    </div>
                  </div>
                ))}
              {/* EMPTY */}
              {item.orders.length === 0 && !getMyOrdersQuery.isLoading && (
                <div className='flex flex-col justify-center items-center space-y-3 py-10'>
                  <PackageOpen size={80} strokeWidth={0.5} className='text-muted-foreground' />
                  <p className='text-muted-foreground'>Quý khách chưa có đơn hàng nào.</p>
                  <Button
                    asChild
                    variant='outline'
                    className='text-blue-500 hover:text-blue-500 border-blue-500 hover:bg-blue-50'
                  >
                    <Link href={PATH.PRODUCT}>Tiếp tục mua hàng</Link>
                  </Button>
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  )
}
