'use client'

import { useMutation } from '@tanstack/react-query'
import { Loader2, PlusCircle, Tag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import productsApis from '@/apis/products.apis'
import { columns } from '@/app/(admin)/_columns/products.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import DataTable from '@/components/data-table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'
import useAllProducts from '@/hooks/useAllProducts'

type AdminProductContext = {
  setCurrentDeletedProductId: React.Dispatch<React.SetStateAction<string | null>>
}

export const AdminProductContext = React.createContext<AdminProductContext>({
  setCurrentDeletedProductId: () => null
})

export default function AdminProduct() {
  const [currentDeletedProductId, setCurrentDeletedProductId] = React.useState<string | null>(null)

  const { totalProduct, allProducts, getAllProductsQuery } = useAllProducts()

  const analyticCards = React.useMemo(
    () => [
      {
        Icon: Tag,
        mainNumber: totalProduct,
        strongText: 'Tổng cộng',
        slimText: 'sản phẩm trên hệ thống'
      }
    ],
    [totalProduct]
  )

  const deleteProductMutation = useMutation({
    mutationKey: ['deleteProduct'],
    mutationFn: productsApis.deleteProduct,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getAllProductsQuery.refetch()
      setCurrentDeletedProductId(null)
    }
  })

  const handleDeleteProduct = () => {
    if (!currentDeletedProductId) return
    deleteProductMutation.mutate(currentDeletedProductId)
  }

  return (
    <React.Fragment>
      <div className='space-y-5'>
        {/* ANALYTIC CARDS */}
        <div className='grid grid-cols-12 gap-5'>
          {analyticCards.map((analyticCard, index) => (
            <div key={index} className='col-span-3'>
              <AnalyticsCard
                Icon={analyticCard.Icon}
                mainNumber={analyticCard.mainNumber}
                strongText={analyticCard.strongText}
                slimText={analyticCard.slimText}
              />
            </div>
          ))}
        </div>
        {/* BUTTONS GROUP */}
        <div className='flex justify-end'>
          <Button asChild size='sm'>
            <Link href={PATH.ADMIN_PRODUCT_NEW}>
              <PlusCircle size={16} className='mr-2' />
              Thêm sản phẩm mới
            </Link>
          </Button>
        </div>
        {/* DATA TABLE */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách sản phẩm</CardTitle>
            <CardDescription>Có {totalProduct} sản phẩm trên hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminProductContext.Provider
              value={{
                setCurrentDeletedProductId
              }}
            >
              <DataTable columns={columns} data={allProducts} searchField='name' />
            </AdminProductContext.Provider>
          </CardContent>
        </Card>
      </div>
      {/* DELETE PRODUCT ALERT DIALOG */}
      <AlertDialog
        open={!!currentDeletedProductId}
        onOpenChange={(value) => {
          if (!value) {
            !deleteProductMutation.isPending && setCurrentDeletedProductId(null)
          }
        }}
      >
        <AlertDialogContent className='max-w-sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vĩnh viễn sản phẩm này?</AlertDialogTitle>
            <AlertDialogDescription>Sản phẩm sẽ không được khôi phục sau khi xóa.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteProductMutation.isPending}>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction disabled={deleteProductMutation.isPending} onClick={handleDeleteProduct}>
              {deleteProductMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
