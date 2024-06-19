'use client'

import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import PATH from '@/constants/path'
import useProductCategories from '@/hooks/useProductCategories'

export default function MegaMenu() {
  const { productCategories, getProductCategoriesQuery } = useProductCategories()

  return (
    <div className='bg-background shadow-sm rounded-md overflow-hidden'>
      {productCategories.map((productCategory) => (
        <Link
          key={productCategory._id}
          href={{
            pathname: PATH.PRODUCT,
            query: {
              categoryId: productCategory._id
            }
          }}
          className='flex items-center space-x-3 px-4 py-2 hover:text-main'
        >
          <Image
            width={20}
            height={20}
            src={productCategory.thumbnail}
            alt={productCategory.name}
            className='w-5 h-5 object-contain aspect-square'
          />
          <span className='text-sm'>{productCategory.name}</span>
        </Link>
      ))}
      {getProductCategoriesQuery.isLoading && (
        <div className='flex justify-center py-5'>
          <Loader2 size={30} strokeWidth={1} className='animate-spin stroke-main' />
        </div>
      )}
    </div>
  )
}
