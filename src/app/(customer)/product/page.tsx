import { Metadata } from 'next'

import Product from '@/app/(customer)/product/product'

export const metadata: Metadata = {
  title: 'Danh sách sản phẩm - Gearvn.',
  description: 'Danh sách sản phẩm - Gearvn.'
}

export default function ProductPage() {
  return <Product />
}
