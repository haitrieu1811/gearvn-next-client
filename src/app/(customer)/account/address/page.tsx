import { Metadata } from 'next'

import AccountAddress from '@/app/(customer)/account/address/address'

export const metadata: Metadata = {
  title: 'Sổ địa chỉ - Gearvn',
  description: 'Sổ địa chỉ - Gearvn'
}

export default function AccountAddressPage() {
  return <AccountAddress />
}
