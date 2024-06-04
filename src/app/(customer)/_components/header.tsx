'use client'

import { AlignJustify, Headset, NotepadText, ShoppingBag, SunMoon } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import CustomerHeaderAuth from '@/app/(customer)/_components/header-auth'
import CustomerHeaderSearch from '@/app/(customer)/_components/header-search'
import PATH from '@/constants/path'

export default function CustomerHeader() {
  const headerActionsRef = React.useRef([
    {
      href: 'tel:0775939704',
      textAbove: 'Hotline',
      textBelow: '0775.939.704',
      icon: <Headset size={26} />
    },
    {
      href: null,
      textAbove: 'Giao diện',
      textBelow: 'Sáng',
      icon: <SunMoon size={26} />,
      onClick: () => {}
    },
    {
      href: PATH.ACCOUNT_ORDER,
      textAbove: 'Tra cứu',
      textBelow: 'đơn hàng',
      icon: <NotepadText size={26} />
    },
    {
      href: PATH.CART,
      textAbove: 'Giỏ',
      textBelow: 'Hàng',
      icon: (
        <div className='relative'>
          <ShoppingBag size={26} />
          <span className='absolute -top-2 -right-1 w-5 h-5 rounded-full bg-yellow-400 flex justify-center items-center border-[2px] border-white'>
            <span className='text-black text-[10px] font-bold'>1</span>
          </span>
        </div>
      )
    }
  ])

  return (
    <header className='bg-main'>
      <div className='max-w-6xl mx-auto py-4 flex justify-between items-center space-x-4'>
        <Link href={PATH.HOME}>
          <Image width={140} height={140} src={'/white-logo.svg'} alt='Logo' />
        </Link>
        <div className='flex items-center space-x-3 text-white bg-main-foreground px-3 h-10 rounded-md'>
          <AlignJustify size={18} />
          <span className='text-sm font-semibold'>Danh mục</span>
        </div>
        <div className='flex-1'>
          <CustomerHeaderSearch />
        </div>
        <div className='flex items-center space-x-5'>
          {headerActionsRef.current.map((headerAction, index) =>
            !!headerAction.href && !headerAction.onClick ? (
              <Link
                key={index}
                href={headerAction.href}
                className='flex items-center space-x-2 text-white leading-tight'
              >
                <div className='flex-shrink-0'>{headerAction.icon}</div>
                <div className='text-[13px] font-medium'>
                  <div>{headerAction.textAbove}</div>
                  <div>{headerAction.textBelow}</div>
                </div>
              </Link>
            ) : (
              <button
                key={index}
                onClick={headerAction.onClick}
                className='flex items-center space-x-2 text-white leading-tight text-left'
              >
                <div className='flex-shrink-0'>{headerAction.icon}</div>
                <div className='text-[13px] font-medium'>
                  <div>{headerAction.textAbove}</div>
                  <div>{headerAction.textBelow}</div>
                </div>
              </button>
            )
          )}
        </div>
        <CustomerHeaderAuth />
      </div>
    </header>
  )
}
