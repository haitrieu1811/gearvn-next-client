'use client'

import Tippy from '@tippyjs/react/headless'
import { Loader2, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { Input } from '@/components/ui/input'
import PATH from '@/constants/path'
import useDebounce from '@/hooks/useDebounce'
import useProducts from '@/hooks/useProducts'
import { formatCurrency } from '@/lib/utils'

const MAX_SEARCH_RESULTS = 5

export default function CustomerHeaderSearch() {
  const [isShowSearchResult, setIsShowSearchResult] = React.useState<boolean>(false)
  const [searchQuery, setSearchQuery] = React.useState<string>('')

  const debounceSearchQuery = useDebounce({ value: searchQuery })

  const searchBoxRef = React.useRef<HTMLDivElement>(null)

  const { products, totalProduct, getPublicProductsQuery } = useProducts({
    name: debounceSearchQuery,
    enabled: !!debounceSearchQuery
  })

  return (
    <Tippy
      visible={!!(isShowSearchResult && debounceSearchQuery)}
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
          {totalProduct > 0 && (
            <div>
              {products.slice(0, MAX_SEARCH_RESULTS).map((product) => (
                <div key={product._id} className='flex justify-between items-center space-x-2 px-4 py-1'>
                  <div className='flex-1'>
                    <Link
                      href={PATH.PRODUCT_DETAIL({ name: product.name, id: product._id })}
                      title={product.name}
                      className='text-[13px] hover:text-main line-clamp-1'
                    >
                      {product.name}
                    </Link>
                    <div className='flex items-center space-x-2'>
                      <div className='text-[13px] font-semibold text-main'>
                        {formatCurrency(product.priceAfterDiscount)}&#8363;
                      </div>
                      {product.priceAfterDiscount < product.originalPrice && (
                        <div className='text-xs line-through text-muted-foreground'>
                          {formatCurrency(product.originalPrice)}&#8363;
                        </div>
                      )}
                    </div>
                  </div>
                  <div className='p-1 border rounded-md'>
                    <Link href={PATH.PRODUCT_DETAIL({ name: product.name, id: product._id })} title={product.name}>
                      <Image width={40} height={40} src={product.thumbnail.url} alt={product.name} />
                    </Link>
                  </div>
                </div>
              ))}
              {totalProduct > MAX_SEARCH_RESULTS && (
                <Link
                  href={PATH.HOME}
                  className='w-full block text-center py-2 text-[13px] text-muted-foreground hover:text-main'
                >
                  Xem thêm sản phẩm
                </Link>
              )}
            </div>
          )}
          {totalProduct === 0 && <div className='text-sm text-center py-4'>Không có sản phẩm nào...</div>}
        </div>
      )}
    >
      <div ref={searchBoxRef} className='relative'>
        <Input
          type='text'
          value={searchQuery}
          placeholder='Bạn cần tìm gì'
          className='bg-background h-10'
          onFocus={() => setIsShowSearchResult(true)}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          disabled={getPublicProductsQuery.isFetching}
          className='absolute top-1/2 -translate-y-1/2 right-0 h-full w-10 flex justify-center items-center'
        >
          {!getPublicProductsQuery.isFetching && <Search size={18} />}
          {getPublicProductsQuery.isFetching && <Loader2 size={18} className='animate-spin' />}
        </button>
      </div>
    </Tippy>
  )
}
