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
      <main>{children}</main>
    </React.Fragment>
  )
}
