import React from 'react'

import AdminHeader from '@/app/(admin)/_components/header'
import AdminSidebar from '@/app/(admin)/_components/sidebar'

export default function AdminLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <React.Fragment>
      <aside className='fixed inset-y-0 left-0 w-[240px] max-h-screen overflow-y-auto hidden lg:block'>
        <AdminSidebar />
      </aside>
      <div className='ml-0 lg:ml-[240px]'>
        <AdminHeader />
        <main className='bg-muted min-h-screen p-5'>{children}</main>
      </div>
    </React.Fragment>
  )
}
