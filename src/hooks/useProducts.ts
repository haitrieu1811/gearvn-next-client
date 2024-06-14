import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productsApis from '@/apis/products.apis'
import { GetProductsReqQuery } from '@/types/products.types'

type UseProductsProps = GetProductsReqQuery & {
  enabled?: boolean
}

export default function useProducts({
  name,
  brandId,
  categoryId,
  highestPrice,
  lowestPrice,
  enabled = true
}: UseProductsProps) {
  const getPublicProductsQuery = useQuery({
    queryKey: ['getPublicProducts', { name, brandId, categoryId, highestPrice, lowestPrice }],
    queryFn: () => productsApis.getProducts({ name, brandId, categoryId, highestPrice, lowestPrice }),
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
