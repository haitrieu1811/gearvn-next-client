import { Metadata } from 'next'

import OrderReview from '@/app/(customer)/cart/order-review/order-review'

export const metadata: Metadata = {
  title: 'Xem lại đơn hàng - GEARVN',
  description: 'Xem lại đơn hàng - GEARVN'
}

export default function OrderReviewPage() {
  return <OrderReview />
}
