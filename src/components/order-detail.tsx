import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { PAYMENT_METHOD } from '@/app/(customer)/cart/order-review/order-review'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import PATH from '@/constants/path'
import { convertMomentToVietnamese, formatCurrency } from '@/lib/utils'
import { OrderItem } from '@/types/orders.types'

export default function OrderDetail({ orderData }: { orderData: OrderItem }) {
  return (
    <React.Fragment>
      <div className='py-5 space-y-5'>
        <h3 className='font-semibold tracking-tight text-xl'>Thông tin đặt hàng</h3>
        <Table className='border'>
          <TableBody>
            <TableRow>
              <TableCell className='font-semibold'>Mã đơn hàng:</TableCell>
              <TableCell>{orderData._id}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Khách hàng:</TableCell>
              <TableCell>{orderData.fullName}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Số điện thoại:</TableCell>
              <TableCell>{orderData.phoneNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Địa chỉ nhận hàng:</TableCell>
              <TableCell>
                {orderData.detailAddress}, {orderData.district.name}, {orderData.province.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Phương thức thanh toán:</TableCell>
              <TableCell>{PAYMENT_METHOD[orderData.paymentMethod || 0]}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Ghi chú:</TableCell>
              <TableCell>{!!orderData.note ? orderData.note : 'Không có ghi chú'}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className='font-semibold'>Đặt lúc:</TableCell>
              <TableCell>
                {moment(orderData.createdAt).format('DD-MM-YYYY')} (
                {convertMomentToVietnamese(moment(orderData.createdAt).fromNow())})
              </TableCell>
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
            {orderData.cartItems.map((cartItem) => (
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
                <div className='flex justify-end'>{orderData.totalItems} sản phẩm</div>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell colSpan={2}>Tổng tiền:</TableCell>
              <TableCell colSpan={2}>
                <div className='flex justify-end text-main font-semibold'>
                  {formatCurrency(orderData.totalAmount || 0)}&#8363;
                </div>
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </React.Fragment>
  )
}
