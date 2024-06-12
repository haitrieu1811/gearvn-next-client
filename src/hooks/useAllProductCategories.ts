import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productCategoriesApis from '@/apis/productCategories.apis'

export default function useAllProductCategories() {
  const getAllProductCategoriesQuery = useQuery({
    queryKey: ['getAllProductCategories'],
    queryFn: () => productCategoriesApis.getAllProductCategories()
  })

  const productCategories = React.useMemo(
    () => getAllProductCategoriesQuery.data?.data.data.productCategories || [],
    [getAllProductCategoriesQuery.data?.data.data.productCategories]
  )
  const totalProductCategory = React.useMemo(
    () => getAllProductCategoriesQuery.data?.data.data.pagination.totalRows || 0,
    [getAllProductCategoriesQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getAllProductCategoriesQuery,
    productCategories,
    totalProductCategory
  }
}
