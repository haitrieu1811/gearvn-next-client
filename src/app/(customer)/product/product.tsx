'use client'

import { Box } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React from 'react'

import Pagination from '@/components/pagination'
import ProductItem from '@/components/product-item'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import useProductCategory from '@/hooks/useProductCategory'
import useProducts from '@/hooks/useProducts'
import { OrderByProduct, SortByProduct } from '@/types/products.types'

export default function Product() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1'
  const limit = searchParams.get('limit') || '20'
  const categoryId = searchParams.get('categoryId') || undefined
  const query = searchParams.get('query') || undefined

  const isSearchMode = !!query

  const [sortBy, setSortBy] = React.useState<SortByProduct | undefined>(undefined)
  const [orderBy, setOrderBy] = React.useState<OrderByProduct | undefined>(undefined)

  const { products, totalProduct, getPublicProductsQuery } = useProducts({
    page,
    limit,
    sortBy,
    orderBy,
    categoryId,
    name: query
  })
  const { productCategory } = useProductCategory(categoryId)

  const totalPages = React.useMemo(
    () => getPublicProductsQuery.data?.data.data.pagination.totalPages || 0,
    [getPublicProductsQuery.data?.data.data.pagination.totalPages]
  )

  const handleSort = (value: string) => {
    const sortBy = value.split('-')[0]
    const orderBy = value.split('-')[1]
    setSortBy(sortBy as SortByProduct)
    setOrderBy(orderBy as OrderByProduct)
  }

  return (
    <div className='py-5'>
      <div className='max-w-6xl mx-auto'>
        <Card>
          <CardHeader className='flex-row justify-center'>
            {!isSearchMode && (
              <CardTitle className='text-2xl'>
                {!productCategory ? 'Danh sách sản phẩm' : productCategory.name}
              </CardTitle>
            )}
            {isSearchMode && (
              <div className='flex flex-col items-center space-y-2'>
                <CardTitle className='text-2xl'>Tìm kiếm</CardTitle>
                <CardDescription>
                  Tìm kiếm theo <strong>{query}</strong>
                </CardDescription>
              </div>
            )}
          </CardHeader>
          <CardContent className='space-y-10'>
            {totalProduct > 1 && (
              <div className='flex justify-between items-center space-x-5'>
                <div></div>
                <Select onValueChange={(value) => handleSort(value)}>
                  <SelectTrigger className='w-[200px]'>
                    <SelectValue placeholder='Sắp xếp theo' />
                  </SelectTrigger>
                  <SelectContent align='end'>
                    <SelectItem value='priceAfterDiscount-asc'>Giá tăng dần</SelectItem>
                    <SelectItem value='priceAfterDiscount-desc'>Giá giảm dần</SelectItem>
                    <SelectItem value='name-asc'>Tên tăng dần</SelectItem>
                    <SelectItem value='name-desc'>Tên giảm dần</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className='grid grid-cols-10 gap-2.5'>
              {products.map((product) => (
                <div key={product._id} className='col-span-2'>
                  <ProductItem productData={product} />
                </div>
              ))}
            </div>
            {totalPages > 1 && <Pagination pageSize={totalPages} />}
            {totalProduct === 0 && (
              <div className='flex flex-col items-center space-y-5'>
                <Box size={100} strokeWidth={0.5} />
                <p>Không có sản phẩm nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
