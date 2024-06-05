import { Metadata } from 'next'

import Admin from '@/app/(admin)/admin/admin'

export const metadata: Metadata = {
  title: 'Gearvn - Admin',
  description: 'Gearvn - Admin'
}

export default function AdminPage() {
  return <Admin />
}
