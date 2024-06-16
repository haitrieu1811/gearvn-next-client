'use client'

import { Key, LogOut, LucideIcon, MapPin, NotepadText, Upload, UserRound } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import InputFile from '@/components/input-file'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { cn } from '@/lib/utils'
import { AccountContext } from '@/providers/account.provider'
import { AppContext } from '@/providers/app.provider'

const LINKS: {
  href: string | null
  name: string
  icon: LucideIcon
  onClick?: () => void
}[] = [
  {
    href: PATH.ACCOUNT,
    name: 'Thông tin tài khoản',
    icon: UserRound
  },
  {
    href: PATH.ACCOUNT_ADDRESS,
    name: 'Sổ địa chỉ',
    icon: MapPin
  },
  {
    href: PATH.ACCOUNT_ORDER,
    name: 'Quản lý đơn hàng',
    icon: NotepadText
  },
  {
    href: PATH.ACCOUNT_PASSWORD,
    name: 'Đổi mật khẩu',
    icon: Key
  },
  {
    href: null,
    name: 'Đăng xuất',
    icon: LogOut,
    onClick: () => {}
  }
] as const

export default function SidebarAccount() {
  const pathname = usePathname()

  const { avatarFile, setAvatarFile } = React.useContext(AccountContext)

  const previewAvatar = React.useMemo(() => (avatarFile ? URL.createObjectURL(avatarFile) : null), [avatarFile])

  const { loggedUser } = React.useContext(AppContext)

  const isClient = useIsClient()

  const handleChangeAvatar = (files: File[] | undefined) => {
    if (!files) return
    setAvatarFile(files[0])
  }

  return (
    <div className='bg-background rounded-md'>
      <div className='flex items-center space-x-3 p-5 border-b'>
        {loggedUser && isClient && (
          <div className='relative group'>
            <Avatar className='w-12 h-12'>
              <AvatarImage
                src={previewAvatar || (loggedUser.avatar && loggedUser.avatar.url)}
                className='object-cover'
              />
              <AvatarFallback>
                {loggedUser.fullName[0].toUpperCase()}
                {loggedUser.fullName[1].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <InputFile onChange={(files) => handleChangeAvatar(files)}>
              <div className='absolute inset-0 bg-muted-foreground/80 rounded-full flex justify-center items-center hover:cursor-pointer opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'>
                <Upload size={16} strokeWidth={3} className='stroke-white' />
              </div>
            </InputFile>
          </div>
        )}
        {loggedUser && isClient && <div className='font-semibold'>{loggedUser.fullName}</div>}
      </div>
      <div>
        {LINKS.map((item, index) => {
          const isActive = item.href === pathname
          let Component: any = 'button'
          const props: any = {}
          if (!!item.href) {
            Component = Link
            props.href = item.href
          }
          return (
            <Component
              key={index}
              {...props}
              className={cn('flex items-center px-5 py-3 w-full text-sm font-medium', {
                'text-main': isActive,
                'hover:text-main': !isActive
              })}
              onClick={item.onClick}
            >
              <item.icon size={20} strokeWidth={1.5} className='mr-3' />
              {item.name}
            </Component>
          )
        })}
      </div>
    </div>
  )
}
