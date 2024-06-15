import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productCategoriesApis from '@/apis/productCategories.apis'

export default function useProductCategories() {
  const getProductCategoriesQuery = useQuery({
    queryKey: ['getProductCategories'],
    queryFn: () => productCategoriesApis.getProductCategories()
  })

  const productCategories = React.useMemo(
    () => getProductCategoriesQuery.data?.data.data.productCategories || [],
    [getProductCategoriesQuery.data?.data.data.productCategories]
  )
  const totalProductCategory = React.useMemo(
    () => getProductCategoriesQuery.data?.data.data.pagination.totalRows || 0,
    [getProductCategoriesQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getProductCategoriesQuery,
    productCategories,
    totalProductCategory
  }
}
