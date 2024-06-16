'use client'

import React from 'react'

import SidebarAccount from '@/app/(customer)/account/_components/sidebar'
import AccountProvider from '@/providers/account.provider'

export default function AccountLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <AccountProvider>
      <div className='flex space-x-5 max-w-6xl mx-auto py-5'>
        <aside className='w-[300px]'>
          <SidebarAccount />
        </aside>
        <div className='flex-1'>{children}</div>
      </div>
    </AccountProvider>
  )
}
