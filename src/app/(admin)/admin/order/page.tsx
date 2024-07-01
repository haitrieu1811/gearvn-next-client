import { Metadata } from 'next'

import AdminOrder from '@/app/(admin)/admin/order/order'

export const metadata: Metadata = {
  title: 'Quản lý đơn hàng - GEARVN ADMIN',
  description: 'Quản lý đơn hàng - GEARVN ADMIN'
}

export default function AdminOrderPage() {
  return <AdminOrder />
}
