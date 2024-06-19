import { Metadata } from 'next'

import AccountPassword from '@/app/(customer)/account/password/password'

export const metadata: Metadata = {
  title: 'Đổi mật khẩu - Gearvn',
  description: 'Đổi mật khẩu - Gearvn'
}

export default function AccountPasswordPage() {
  return <AccountPassword />
}
