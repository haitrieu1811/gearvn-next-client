'use client'

import { useQuery } from '@tanstack/react-query'
import { GalleryVerticalEnd, PlusCircle } from 'lucide-react'
import React from 'react'

import productCategoriesApis from '@/apis/productCategories.apis'
import { columns } from '@/app/(admin)/_columns/productCategories.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import CreateProductCategoryForm from '@/app/(admin)/_components/create-product-category-form'
import DataTable from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

type AdminProductCategoryContext = {
  setCurrentProductCategoryId: React.Dispatch<React.SetStateAction<string | null>>
}

export const AdminProductCategoryContext = React.createContext<AdminProductCategoryContext>({
  setCurrentProductCategoryId: () => null
})

export default function AdminProductCategory() {
  const [isOpenCreateProductCategoryDialog, setIsOpenCreateProductCategoryDialog] = React.useState<boolean>(false)
  const [currentProductCategoryId, setCurrentProductCategoryId] = React.useState<string | null>(null)

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
  const analyticCards = React.useMemo(
    () => [
      {
        icon: GalleryVerticalEnd,
        strongText: 'Tổng cộng',
        slimText: 'danh mục sản phẩm trên hệ thống',
        mainNumber: totalProductCategory
      }
    ],
    [totalProductCategory]
  )

  return (
    <React.Fragment>
      <div className='space-y-5'>
        {/* ANALYTIC CARDS */}
        <div className='grid grid-cols-12 gap-5'>
          {analyticCards.map((analyticCard, index) => (
            <div key={index} className='col-span-3'>
              <AnalyticsCard
                Icon={analyticCard.icon}
                mainNumber={analyticCard.mainNumber}
                strongText={analyticCard.strongText}
                slimText={analyticCard.slimText}
              />
            </div>
          ))}
        </div>
        {/* BUTTONS GROUP */}
        <div className='flex justify-end'>
          <Button size='sm' onClick={() => setIsOpenCreateProductCategoryDialog(true)}>
            <PlusCircle size={16} strokeWidth={1.5} className='mr-2' />
            Thêm danh mục sản phẩm mới
          </Button>
        </div>
        {/* TABLE DATA */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách tất cả danh mục sản phẩm</CardTitle>
            <CardDescription>Có {totalProductCategory} danh mục sản phẩm trên hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminProductCategoryContext.Provider
              value={{
                setCurrentProductCategoryId
              }}
            >
              <DataTable columns={columns} data={productCategories} />
            </AdminProductCategoryContext.Provider>
          </CardContent>
        </Card>
      </div>
      {/* CREATE PRODUCT CATEGORY DIALOG */}
      <Dialog
        open={isOpenCreateProductCategoryDialog}
        onOpenChange={(value) => setIsOpenCreateProductCategoryDialog(value)}
      >
        <DialogContent className='max-h-screen overflow-y-auto max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Tạo danh mục sản phẩm mới</DialogTitle>
          </DialogHeader>
          <CreateProductCategoryForm onCreateSuccess={() => setIsOpenCreateProductCategoryDialog(false)} />
        </DialogContent>
      </Dialog>
      {/* UPDATE PRODUCT CATEGORY DIALOG */}
      <Dialog
        open={!!currentProductCategoryId}
        onOpenChange={(value) => {
          if (!value) {
            setCurrentProductCategoryId(null)
          }
        }}
      >
        <DialogContent className='max-h-screen overflow-y-auto max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Cập nhật danh mục sản phẩm </DialogTitle>
          </DialogHeader>
          <CreateProductCategoryForm productCategoryId={currentProductCategoryId || undefined} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
