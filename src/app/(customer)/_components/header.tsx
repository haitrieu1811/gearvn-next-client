'use client'

import Tippy from '@tippyjs/react/headless'
import {
  AlignJustify,
  CreditCard,
  Database,
  Headset,
  MapPin,
  Newspaper,
  NotepadText,
  ShieldCheck,
  ShoppingBag,
  Ticket,
  Video,
  X
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import CustomerHeaderAuth from '@/app/(customer)/_components/header-auth'
import CustomerHeaderSearch from '@/app/(customer)/_components/header-search'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { formatCurrency } from '@/lib/utils'

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
        href: PATH.HOME,
        textAbove: 'Hệ thống',
        textBelow: 'Showroom',
        icon: <MapPin className='w-5' />
      },
      {
        href: PATH.ACCOUNT_ORDER,
        textAbove: 'Tra cứu',
        textBelow: 'đơn hàng',
        icon: <NotepadText className='w-5' />
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
        <div className='max-w-6xl mx-auto py-4 flex justify-between items-center space-x-5'>
          {/* LOGO */}
          <Link href={PATH.HOME}>
            <Image priority width={140} height={140} src={'/white-logo.svg'} alt='Logo' />
          </Link>
          {/* CATEGORIES BUTTON */}
          <div className='flex items-center space-x-3 text-white bg-main-foreground px-2 h-10 rounded-md'>
            <AlignJustify size={18} />
            <span className='text-[13px] font-semibold tracking-tight'>Danh mục</span>
          </div>
          {/* SEARCH */}
          <div className='flex-1'>
            <CustomerHeaderSearch />
          </div>
          {/* HEADER ACTIONS */}
          <div className='flex items-center space-x-5'>
            {headerActions.map((item, index) => (
              <Link key={index} href={item.href} className='flex items-center space-x-2 text-white leading-tight'>
                <div className='flex-shrink-0'>{item.icon}</div>
                <div className='text-[13px] font-medium'>
                  <div>{item.textAbove}</div>
                  <div>{item.textBelow}</div>
                </div>
              </Link>
            ))}
          </div>
          {/* CART */}
          <Tippy
            interactive
            placement='bottom-end'
            offset={[0, 10]}
            render={() => (
              <div className='bg-background shadow rounded-md border w-[350px]'>
                <div className='border-b p-4 text-sm flex space-x-5 items-center'>
                  <div className='flex items-center space-x-2'>
                    <ShoppingBag size={16} strokeWidth={1.5} />
                    <span className='font-semibold'>10</span>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <Database size={16} strokeWidth={1.5} />
                    <span className='text-main font-semibold'>{formatCurrency(3190000)}&#8363;</span>
                  </div>
                </div>
                <div className='max-h-[350px] overflow-y-auto'>
                  {Array(10)
                    .fill(0)
                    .map((_, index) => (
                      <div key={index} className='flex items-start space-x-3 px-4 py-2'>
                        <Link href={PATH.HOME} className='flex-shrink-0 border p-1 rounded-md overflow-hidden'>
                          <Image
                            width={60}
                            height={60}
                            src={'/product.webp'}
                            alt=''
                            className='w-[60px] object-cover aspect-square'
                          />
                        </Link>
                        <div className='flex-1 space-y-1'>
                          <Link
                            href={PATH.HOME}
                            className='text-sm text-muted-foreground line-clamp-2 hover:underline'
                          >{`Màn hình Philips 24M2N3200S 24" IPS 180Hz chuyên game`}</Link>
                          <div className='flex items-center space-x-1'>
                            <div className='text-sm font-semibold'>{formatCurrency(3190000)}&#8363;</div>
                            <X size={14} strokeWidth={1} />
                            <div className='text-sm text-muted-foreground'>28</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
                <div className='flex justify-end space-x-2 p-4 border-t'>
                  <Button asChild variant='outline'>
                    <Link href={PATH.CART}>Thanh toán</Link>
                  </Button>
                  <Button asChild>
                    <Link href={PATH.CART}>Xem giỏ hàng</Link>
                  </Button>
                </div>
              </div>
            )}
          >
            <Link href={PATH.CART} className='flex items-center space-x-2 text-white leading-tight'>
              <div className='flex-shrink-0'>
                <div className='relative'>
                  <ShoppingBag className='w-5' />
                  <span className='absolute -top-2 -right-1.5 w-[18px] h-[18px] rounded-full bg-yellow-400 flex justify-center items-center border-[2px] border-white'>
                    <span className='text-black text-[10px] font-bold'>1</span>
                  </span>
                </div>
              </div>
              <div className='text-[13px] font-medium'>
                <div>Giỏ</div>
                <div>hàng</div>
              </div>
            </Link>
          </Tippy>

          {/* CUSTOMER AUTH */}
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
