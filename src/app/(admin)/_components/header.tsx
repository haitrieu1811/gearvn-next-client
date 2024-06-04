'use client'

import Tippy from '@tippyjs/react/headless'
import Link from 'next/link'
import React from 'react'

import PopoverWrapper from '@/components/popover-wrapper'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { ModeToggle } from '@/components/mode-toggle'

export default function AdminHeader() {
  const accountItemsRef = React.useRef([
    {
      href: PATH.ACCOUNT,
      name: 'Tài khoản'
    },
    {
      name: 'Đăng xuất',
      onClick: () => {}
    }
  ])

  return (
    <header className='flex justify-between items-center px-4 py-2'>
      <div></div>
      <div className='flex items-center space-x-10'>
        <ModeToggle />
        <Tippy
          trigger='click'
          interactive
          placement='bottom-end'
          offset={[0, 10]}
          render={() => (
            <PopoverWrapper>
              {accountItemsRef.current.map((accountItem) => (
                <Button
                  asChild={!!accountItem.href}
                  key={accountItem.name}
                  variant='ghost'
                  className='flex justify-start w-full pr-10 rounded-none'
                  onClick={accountItem.onClick}
                >
                  {accountItem.href && !accountItem.onClick ? (
                    <Link href={accountItem.href}>{accountItem.name}</Link>
                  ) : (
                    accountItem.name
                  )}
                </Button>
              ))}
            </PopoverWrapper>
          )}
        >
          <Avatar>
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </Tippy>
      </div>
    </header>
  )
}
