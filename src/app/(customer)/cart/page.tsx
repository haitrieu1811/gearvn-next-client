import { Metadata } from 'next'

import Cart from '@/app/(customer)/cart/cart'

export const metadata: Metadata = {
  title: 'Giỏ hàng của bạn - Gearvn.',
  description: 'Giỏ hàng của bạn - Gearvn.'
}

export default function CartPage() {
  return <Cart />
}
