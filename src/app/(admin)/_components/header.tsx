'use client'

import Tippy from '@tippyjs/react/headless'
import Link from 'next/link'
import React from 'react'

import { ModeToggle } from '@/components/mode-toggle'
import PopoverWrapper from '@/components/popover-wrapper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app.provider'

export default function AdminHeader() {
  const { loggedUser } = React.useContext(AppContext)

  const isClient = useIsClient()

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
    <header className='flex justify-end items-center px-4 py-2 sticky top-0 right-0 bg-background'>
      <div className='flex items-center space-x-10'>
        <ModeToggle />
        {!!loggedUser && isClient && (
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
              <AvatarImage src={loggedUser.avatar} alt={loggedUser.fullName} />
              <AvatarFallback>{`${loggedUser.fullName[0].toUpperCase()}${loggedUser.fullName[1].toUpperCase()}`}</AvatarFallback>
            </Avatar>
          </Tippy>
        )}
      </div>
    </header>
  )
}
