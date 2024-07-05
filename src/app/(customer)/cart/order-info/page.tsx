import { Metadata } from 'next'

import OrderInfo from '@/app/(customer)/cart/order-info/order-info'

export const metadata: Metadata = {
  title: 'Thông tin đặt hàng - GEARVN',
  description: 'Thông tin đặt hàng - GEARVN'
}

export default function OrderInfoPage() {
  return <OrderInfo />
}
