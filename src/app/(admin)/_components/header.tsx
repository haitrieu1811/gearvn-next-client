'use client'

import Tippy from '@tippyjs/react/headless'
import { ChevronLeft, Menu } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

import AdminSidebar from '@/app/(admin)/_components/sidebar'
import { ModeToggle } from '@/components/mode-toggle'
import PopoverWrapper from '@/components/popover-wrapper'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app.provider'

export default function AdminHeader() {
  const router = useRouter()

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
    <header className='flex justify-between items-center px-4 py-2 bg-background sticky top-0 inset-x-0 z-10'>
      <div className='flex lg:hidden items-center space-x-5'>
        <Sheet>
          <SheetTrigger asChild>
            <Button size='icon' variant='outline' className='lg:hidden'>
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='max-h-screen overflow-y-auto p-0'>
            <AdminSidebar />
          </SheetContent>
        </Sheet>
        <Link href={PATH.ADMIN} className='flex lg:hidden flex-col items-end leading-none'>
          <span className='text-xl font-bold tracking-tight'>Gearvn</span>
          <span className='text-xs text-muted-foreground tracking-tight uppercase'>Admin</span>
        </Link>
      </div>
      <div>
        <Button variant='ghost' size='sm' className='uppercase tracking-tight' onClick={() => router.back()}>
          <ChevronLeft size={18} strokeWidth={1.5} className='mr-1' />
          Quay lại
        </Button>
      </div>
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
            <div className='flex items-center space-x-2'>
              <Avatar className='w-8 h-8'>
                <AvatarImage src={loggedUser.avatar && loggedUser.avatar.url} alt={loggedUser.fullName} />
                <AvatarFallback>{`${loggedUser.fullName[0].toUpperCase()}${loggedUser.fullName[1].toUpperCase()}`}</AvatarFallback>
              </Avatar>
              <span className='text-sm text-muted-foreground'>{loggedUser.fullName}</span>
            </div>
          </Tippy>
        )}
      </div>
    </header>
  )
}
