import React from 'react'

import CustomerHeader from '@/app/(customer)/_components/header'
import CustomerFooter from '@/app/(customer)/_components/footer'

export default function CustomerLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <React.Fragment>
      <CustomerHeader />
      <main className='bg-muted min-h-screen'>{children}</main>
      <CustomerFooter />
    </React.Fragment>
  )
}
