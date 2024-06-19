import { useQuery } from '@tanstack/react-query'
import React from 'react'

import productCategoriesApis from '@/apis/productCategories.apis'

export default function useProductCategory(productCategoryId: string | undefined) {
  const getProductCategoryByIdQuery = useQuery({
    queryKey: ['getProductCategoryId', productCategoryId],
    queryFn: () => productCategoriesApis.getProductCategoryById(productCategoryId as string),
    enabled: !!productCategoryId
  })

  const productCategory = React.useMemo(
    () => getProductCategoryByIdQuery.data?.data.data.productCategory,
    [getProductCategoryByIdQuery.data?.data.data.productCategory]
  )

  return {
    getProductCategoryByIdQuery,
    productCategory
  }
}
