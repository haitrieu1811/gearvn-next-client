import React from 'react'

import AdminHeader from '@/app/(admin)/_components/header'
import AdminSidebar from '@/app/(admin)/_components/sidebar'

const SIDEBAR_WIDTH = 240

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <React.Fragment>
      <aside
        style={{
          width: `${SIDEBAR_WIDTH}px`
        }}
        className='fixed inset-y-0 left-0 w-[200px]'
      >
        <AdminSidebar />
      </aside>
      <div
        style={{
          marginLeft: `${SIDEBAR_WIDTH}px`
        }}
      >
        <AdminHeader />
        <main className='bg-muted min-h-screen'>{children}</main>
      </div>
    </React.Fragment>
  )
}
