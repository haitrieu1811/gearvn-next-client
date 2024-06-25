import { Metadata } from 'next'

import AccountOrder from '@/app/(customer)/account/order/order'

export const metadata: Metadata = {
  title: 'Đơn hàng của tôi - GEARVN',
  description: 'Đơn hàng của tôi - GEARVN'
}

export default function AccountOrderPage() {
  return <AccountOrder />
}
