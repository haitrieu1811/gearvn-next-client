'use client'

import {
  AlignJustify,
  CreditCard,
  Database,
  Headset,
  Newspaper,
  NotepadText,
  ShieldCheck,
  ShoppingBag,
  SunMoon,
  Ticket,
  Video
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import CustomerHeaderAuth from '@/app/(customer)/_components/header-auth'
import CustomerHeaderSearch from '@/app/(customer)/_components/header-search'
import PATH from '@/constants/path'

export default function CustomerHeader() {
  const headerActions = React.useMemo(
    () => [
      {
        href: 'tel:0775939704',
        textAbove: 'Hotline',
        textBelow: '0775.939.704',
        icon: <Headset className='w-5' />
      },
      {
        href: null,
        textAbove: 'Giao diện',
        textBelow: 'Sáng',
        icon: <SunMoon className='w-5' />,
        onClick: () => {}
      },
      {
        href: PATH.ACCOUNT_ORDER,
        textAbove: 'Tra cứu',
        textBelow: 'đơn hàng',
        icon: <NotepadText className='w-5' />
      },
      {
        href: PATH.CART,
        textAbove: 'Giỏ',
        textBelow: 'Hàng',
        icon: (
          <div className='relative'>
            <ShoppingBag className='w-5' />
            <span className='absolute -top-2 -right-1.5 w-[18px] h-[18px] rounded-full bg-yellow-400 flex justify-center items-center border-[2px] border-white'>
              <span className='text-black text-[10px] font-bold'>1</span>
            </span>
          </div>
        )
      }
    ],
    []
  )

  const subMenuItems = React.useMemo(
    () => [
      {
        href: PATH.HOME,
        icon: Ticket,
        name: 'Săn Voucher GEARVN'
      },
      {
        href: PATH.HOME,
        icon: Newspaper,
        name: 'Tin công nghệ'
      },
      {
        href: PATH.HOME,
        icon: Video,
        name: 'Video'
      },
      {
        href: PATH.HOME,
        icon: CreditCard,
        name: 'Hướng dẫn thanh toán'
      },
      {
        href: PATH.HOME,
        icon: Database,
        name: 'Hướng dẫn trả góp'
      },
      {
        href: PATH.HOME,
        icon: ShieldCheck,
        name: 'Tra cứu bảo hành'
      }
    ],
    []
  )

  return (
    <React.Fragment>
      {/* HEADER */}
      <header className='bg-main sticky top-0 inset-x-0 z-10'>
        <div className='max-w-6xl mx-auto py-4 flex justify-between items-center space-x-4'>
          <Link href={PATH.HOME}>
            <Image width={140} height={140} src={'/white-logo.svg'} alt='Logo' />
          </Link>
          <div className='flex items-center space-x-3 text-white bg-main-foreground px-2 h-10 rounded-md'>
            <AlignJustify size={18} />
            <span className='text-[13px] font-semibold tracking-tight'>Danh mục</span>
          </div>
          <div className='flex-1'>
            <CustomerHeaderSearch />
          </div>
          <div className='flex items-center space-x-5'>
            {headerActions.map((item, index) =>
              !!item.href && !item.onClick ? (
                <Link key={index} href={item.href} className='flex items-center space-x-2 text-white leading-tight'>
                  <div className='flex-shrink-0'>{item.icon}</div>
                  <div className='text-[13px] font-medium'>
                    <div>{item.textAbove}</div>
                    <div>{item.textBelow}</div>
                  </div>
                </Link>
              ) : (
                <button
                  key={index}
                  onClick={item.onClick}
                  className='flex items-center space-x-2 text-white leading-tight text-left'
                >
                  <div className='flex-shrink-0'>{item.icon}</div>
                  <div className='text-[13px] font-medium'>
                    <div>{item.textAbove}</div>
                    <div>{item.textBelow}</div>
                  </div>
                </button>
              )
            )}
          </div>
          <CustomerHeaderAuth />
        </div>
      </header>
      {/* SUBMENU */}
      <div className='bg-background shadow-sm'>
        <div className='flex max-w-6xl mx-auto'>
          {subMenuItems.map((item, index) => (
            <Link
              key={index}
              href={item.href}
              className='flex items-center justify-center space-x-2 flex-auto py-3 hover:text-main relative after:h-5 after:w-[1px] after:bg-muted-foreground after:absolute after:top-1/2 after:-translate-y-1/2 after:right-0 last:after:hidden'
            >
              <item.icon strokeWidth={1.5} size={18} />
              <span className='text-[13px] font-medium'>{item.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </React.Fragment>
  )
}
