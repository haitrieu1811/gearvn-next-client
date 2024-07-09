import { useQuery } from '@tanstack/react-query'
import React from 'react'

import reviewsApis from '@/apis/reviews.apis'

export default function useReviewsByProductId({ productId }: { productId: string }) {
  const getReviewsByProductIdQuery = useQuery({
    queryKey: ['getReviewsByProductId', productId],
    queryFn: () => reviewsApis.getReviewsByProductId({ productId })
  })

  const reviews = React.useMemo(
    () => getReviewsByProductIdQuery.data?.data.data.reviews || [],
    [getReviewsByProductIdQuery.data?.data.data.reviews]
  )
  const totalReview = React.useMemo(
    () => getReviewsByProductIdQuery.data?.data.data.pagination.totalRows || 0,
    [getReviewsByProductIdQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getReviewsByProductIdQuery,
    reviews,
    totalReview
  }
}
