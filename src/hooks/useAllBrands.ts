import { useQuery } from '@tanstack/react-query'
import React from 'react'

import brandsApis from '@/apis/brands.apis'

export default function useAllBrands() {
  const getAllBrandsQuery = useQuery({
    queryKey: ['getAllBrands'],
    queryFn: () => brandsApis.getAllBrands()
  })

  const allBrands = React.useMemo(
    () => getAllBrandsQuery.data?.data.data.brands || [],
    [getAllBrandsQuery.data?.data.data.brands]
  )
  const totalBrand = React.useMemo(
    () => getAllBrandsQuery.data?.data.data.pagination.totalRows || 0,
    [getAllBrandsQuery.data?.data.data.pagination.totalRows]
  )

  return {
    getAllBrandsQuery,
    allBrands,
    totalBrand
  }
}
