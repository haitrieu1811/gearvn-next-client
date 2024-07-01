import { Metadata } from 'next'

import OrderDetail from '@/app/(customer)/account/order/[id]/order-detail'

export const metadata: Metadata = {
  title: 'Chi tiết đơn hàng - GEARVN',
  description: 'Chi tiết đơn hàng - GEARVN'
}

export default function AccountOrderDetailPage({ params }: { params: { id: string } }) {
  const { id } = params
  return <OrderDetail orderId={id} />
}
