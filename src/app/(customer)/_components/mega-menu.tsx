import Image from 'next/image'
import Link from 'next/link'

import PATH from '@/constants/path'
import { ProductCategoryItem } from '@/types/productCategories.types'

export default async function MegaMenu() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1/product-categories`).then((res) =>
    res.json()
  )
  const productCategories = response.data.productCategories as ProductCategoryItem[]

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
    </div>
  )
}
