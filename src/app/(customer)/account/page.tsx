import { Metadata } from 'next'

import Account from '@/app/(customer)/account/account'

export const metadata: Metadata = {
  title: 'Tài khoản của tôi - Gearvn',
  description: 'Tài khoản của tôi - Gearvn'
}

export default function AccountPage() {
  return <Account />
}
