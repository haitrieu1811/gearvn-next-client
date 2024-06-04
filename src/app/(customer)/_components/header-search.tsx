'use client'

import Tippy from '@tippyjs/react/headless'
import { Loader2, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Input } from '@/components/ui/input'
import PATH from '@/constants/path'
import { formatCurrency } from '@/lib/utils'

const MAX_SEARCH_RESULTS = 5

export default function CustomerHeaderSearch() {
  const [isShowSearchResult, setIsShowSearchResult] = React.useState<boolean>(false)

  const searchBoxRef = React.useRef<HTMLDivElement>(null)

  return (
    <Tippy
      visible={isShowSearchResult}
      interactive
      placement='bottom-end'
      offset={[0, 3]}
      onClickOutside={() => setIsShowSearchResult(false)}
      render={() => (
        <div
          style={{
            width: `${searchBoxRef.current?.offsetWidth}px`
          }}
          className='bg-background rounded-md shadow border'
        >
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className='flex justify-between items-center space-x-10 px-4 py-1'>
                <div className='flex-1'>
                  <Link href={PATH.HOME} className='text-sm hover:text-main line-clamp-1'>
                    Bo mạch chủ MSI A320M-A Pro
                  </Link>
                  <div className='flex items-center space-x-2'>
                    <div className='text-sm font-medium text-main'>{formatCurrency(1390000)}&#8363;</div>
                    <div className='text-xs line-through text-muted-foreground'>{formatCurrency(1390000)}&#8363;</div>
                  </div>
                </div>
                <div className='p-1 border rounded-md'>
                  <Link href={PATH.HOME}>
                    <Image width={40} height={40} src={'/product.webp'} alt='' />
                  </Link>
                </div>
              </div>
            ))}
          <Link
            href={PATH.HOME}
            className='w-full block text-center py-2 text-sm text-muted-foreground hover:text-main'
          >
            Xem thêm sản phẩm
          </Link>
          {false && <div className='text-sm text-center py-4'>Không có sản phẩm nào...</div>}
        </div>
      )}
    >
      <div ref={searchBoxRef} className='relative'>
        <Input
          type='text'
          placeholder='Bạn cần tìm gì'
          className='bg-background h-10'
          onFocus={() => setIsShowSearchResult(true)}
        />
        <button className='absolute top-1/2 -translate-y-1/2 right-0 h-full w-10 flex justify-center items-center'>
          <Search size={18} />
          {false && <Loader2 size={18} className='animate-spin' />}
        </button>
      </div>
    </Tippy>
  )
}
