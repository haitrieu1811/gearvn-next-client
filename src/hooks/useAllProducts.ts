import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productsApis from '@/apis/products.apis'

export default function useAllProducts() {
  const getAllProductsQuery = useQuery({
    queryKey: ['getAllProducts'],
    queryFn: () => productsApis.getAllProducts()
  })

  const allProducts = React.useMemo(
    () => getAllProductsQuery.data?.data.data.products || [],
    [getAllProductsQuery.data?.data.data.products]
  )
  const totalProduct = React.useMemo(
    () => getAllProductsQuery.data?.data.data.pagination.totalRows || 0,
    [getAllProductsQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getAllProductsQuery,
    allProducts,
    totalProduct
  }
}
