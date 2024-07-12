'use client'

import { useQuery } from '@tanstack/react-query'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import productsApis from '@/apis/products.apis'
import { approvalStatuses } from '@/app/(admin)/_columns/products.columns'
import CreateProductForm from '@/app/(admin)/_components/create-product-form'
import ReviewItem from '@/components/review-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import useReviewsByProductId from '@/hooks/useReviewsByProductId'

type ProductDetailProps = {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const router = useRouter()

  const getProductForUpdateQuery = useQuery({
    queryKey: ['getProductForUpdate', productId],
    queryFn: () => productsApis.getProductForUpdate(productId as string),
    enabled: !!productId
  })

  const product = React.useMemo(
    () => getProductForUpdateQuery.data?.data.data.product,
    [getProductForUpdateQuery.data?.data.data.product]
  )

  const { reviews, totalReview } = useReviewsByProductId({ productId })

  return (
    <div className='space-y-5'>
      <div className='flex items-center space-x-3'>
        <Button type='button' size='icon' variant='outline' className='w-8 h-8' onClick={() => router.back()}>
          <ChevronLeft size={16} />
        </Button>
        <div className='flex items-center space-x-3'>
          <h1 className='text-xl tracking-tight font-semibold'>{product?.name}</h1>
          {product && approvalStatuses[product.approvalStatus]}
        </div>
      </div>
      <Tabs defaultValue='info'>
        <TabsList>
          <TabsTrigger value='info'>Thông tin sản phẩm</TabsTrigger>
          <TabsTrigger value='review'>Đánh giá sản phẩm</TabsTrigger>
        </TabsList>
        <TabsContent value='info' className='pt-5'>
          {!!product && <CreateProductForm productData={product} />}
        </TabsContent>
        <TabsContent value='review' className='pt-5'>
          <Card>
            <CardContent>
              {totalReview > 0 && reviews.map((review) => <ReviewItem key={review._id} reviewData={review} />)}
              {totalReview === 0 && <div className='pt-5 text-sm'>Sản phẩm chưa có đánh giá nào.</div>}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
