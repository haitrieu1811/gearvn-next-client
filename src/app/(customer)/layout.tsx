import React from 'react'

import CustomerHeader from '@/app/(customer)/_components/header'

export default function CustomerLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <React.Fragment>
      <CustomerHeader />
      <main className='bg-muted min-h-screen'>{children}</main>
    </React.Fragment>
  )
}
