import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productsApis from '@/apis/products.apis'
import { GetProductsReqQuery } from '@/types/products.types'

type UseProductsProps = GetProductsReqQuery & {
  enabled?: boolean
}

export default function useProducts({
  page,
  limit,
  name,
  brandId,
  categoryId,
  highestPrice,
  lowestPrice,
  sortBy,
  orderBy,
  enabled = true
}: UseProductsProps) {
  const getPublicProductsQuery = useQuery({
    queryKey: [
      'getPublicProducts',
      { page, limit, name, brandId, categoryId, highestPrice, lowestPrice, sortBy, orderBy }
    ],
    queryFn: () =>
      productsApis.getProducts({ page, limit, name, brandId, categoryId, highestPrice, lowestPrice, sortBy, orderBy }),
    enabled
  })

  const products = React.useMemo(
    () => getPublicProductsQuery.data?.data.data.products || [],
    [getPublicProductsQuery.data?.data.data.products]
  )
  const totalProduct = React.useMemo(
    () => getPublicProductsQuery.data?.data.data.pagination.totalRows || 0,
    [getPublicProductsQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getPublicProductsQuery,
    products,
    totalProduct
  }
}
