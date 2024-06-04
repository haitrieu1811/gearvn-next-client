'use client'

import { Home, StickyNote, Store, Tags, TicketPercent, UsersRound } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'

export default function AdminSidebar() {
  const sidebarItemsRef = React.useRef([
    {
      href: PATH.HOME,
      name: 'Cửa hàng',
      icon: Store,
      notificationCount: 0
    },
    {
      href: PATH.ADMIN,
      name: 'Trang chủ',
      icon: Home,
      notificationCount: 0
    },
    {
      href: PATH.ADMIN_USER,
      name: 'Quản lý người dùng',
      icon: UsersRound,
      notificationCount: 0
    },
    {
      href: PATH.ADMIN_PRODUCT,
      name: 'Quản lý sản phẩm',
      icon: Tags,
      notificationCount: 0
    },
    {
      href: PATH.ADMIN_POST,
      name: 'Quản lý bài viết',
      icon: StickyNote,
      notificationCount: 0
    },
    {
      href: PATH.ADMIN_ORDER,
      name: 'Quản lý đơn hàng',
      icon: TicketPercent,
      notificationCount: 0
    }
  ])

  return (
    <React.Fragment>
      <div className='p-4'>
        <Link href={PATH.ADMIN} className='flex flex-col items-end'>
          <span className='font-bold text-3xl'>Gearvn</span>
          <span className='uppercase text-muted-foreground text-sm'>admin</span>
        </Link>
      </div>
      <div className='p-2 space-y-1'>
        {sidebarItemsRef.current.map((sidebarItem) => (
          <Button key={sidebarItem.href} asChild variant='ghost' className='flex justify-between w-full'>
            <Link href={sidebarItem.href} className='text-muted-foreground'>
              <div className='flex items-center space-x-3'>
                <sidebarItem.icon size={18} />
                <span className='capitalize'>{sidebarItem.name}</span>
              </div>
              {!!sidebarItem.notificationCount && (
                <span className='text-[10px] font-bold bg-main text-white w-5 h-5 rounded-full flex justify-center items-center'>
                  {sidebarItem.notificationCount}
                </span>
              )}
            </Link>
          </Button>
        ))}
      </div>
    </React.Fragment>
  )
}
