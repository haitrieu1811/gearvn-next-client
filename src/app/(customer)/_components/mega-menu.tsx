'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

import useProductCategories from '@/hooks/useProductCategories'
import PATH from '@/constants/path'

export default function MegaMenu() {
  const { productCategories } = useProductCategories()

  return (
    <div className='bg-background shadow-sm rounded-md overflow-hidden'>
      {productCategories.map((productCategory) => (
        <Link
          key={productCategory._id}
          href={PATH.HOME}
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
    </div>
  )
}
