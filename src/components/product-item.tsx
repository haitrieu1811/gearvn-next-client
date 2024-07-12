import { Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import PATH from '@/constants/path'
import { formatCurrency, rateSale } from '@/lib/utils'
import { ProductItem as ProductItemType } from '@/types/products.types'

type ProductItemProps = {
  productData: ProductItemType
}

export default function ProductItem({ productData }: ProductItemProps) {
  const { _id, name, thumbnail, originalPrice, priceAfterDiscount } = productData
  const detailLink = PATH.PRODUCT_DETAIL({ name, id: _id })
  return (
    <div className='border rounded-md'>
      <Link href={detailLink} title={name}>
        <Image
          width={500}
          height={500}
          src={thumbnail.url}
          alt={name}
          className='w-full aspect-square rounded-md object-cover'
        />
      </Link>
      <div className='px-3 pt-1 pb-4 space-y-2'>
        <Link href={detailLink} title={name} className='text-sm font-medium line-clamp-2 hover:underline'>
          {name}
        </Link>
        <div className='flex items-end space-x-3'>
          <div>
            {priceAfterDiscount < originalPrice && (
              <div className='text-xs text-muted-foreground line-through'>{formatCurrency(originalPrice)}&#8363;</div>
            )}
            <div className='text-sm text-main font-semibold'>{formatCurrency(priceAfterDiscount)}&#8363;</div>
          </div>
          {priceAfterDiscount < originalPrice && (
            <Badge variant='outline' className='border-main text-main rounded-sm'>
              -{rateSale(originalPrice, priceAfterDiscount)}%
            </Badge>
          )}
        </div>
        <div className='flex items-center space-x-2'>
          <div className='flex items-center space-x-1 text-yellow-500'>
            <span className='text-xs font-semibold'>{productData.review.averageReview.toFixed(1)}</span>
            <Star size={13} className='fill-yellow-500' />
          </div>
          <div className='text-xs text-muted-foreground'>({productData.review.totalReview} đánh giá)</div>
        </div>
      </div>
    </div>
  )
}
