import { Metadata } from 'next'

import Account from '@/app/(customer)/account/account'

export const metadata: Metadata = {
  title: 'Gearvn - Tài khoản của tôi.',
  description: 'Gearvn - Tài khoản của tôi.'
}

export default function AccountPage() {
  return <Account />
}
