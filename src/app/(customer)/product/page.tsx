import { Metadata } from 'next'

import Product from '@/app/(customer)/product/product'

export const metadata: Metadata = {
  title: 'Danh sách sản phẩm - GEARVN',
  description: 'Danh sách sản phẩm - GEARVN'
}

export default function ProductPage() {
  return <Product />
}
