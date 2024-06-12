'use client'

import { useMutation } from '@tanstack/react-query'
import { CirclePlus, Goal, Loader2 } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import brandsApis from '@/apis/brands.apis'
import { columns } from '@/app/(admin)/_columns/brands.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import CreateBrandForm from '@/app/(admin)/_components/create-brand-form'
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
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useAllBrands from '@/hooks/useAllBrands'

type AdminBrandContext = {
  setCurrentUpdatedBrandId: React.Dispatch<React.SetStateAction<string | null>>
  setCurrentDeletedBrandId: React.Dispatch<React.SetStateAction<string | null>>
}

export const AdminBrandContext = React.createContext<AdminBrandContext>({
  setCurrentUpdatedBrandId: () => null,
  setCurrentDeletedBrandId: () => null
})

export default function AdminBrand() {
  const [isOpenCreateBrandDialog, setIsOpenCreateBrandDialog] = React.useState<boolean>(false)
  const [currentUpdatedBrandId, setCurrentUpdatedBrandId] = React.useState<string | null>(null)
  const [currentDeletedBrandId, setCurrentDeletedBrandId] = React.useState<string | null>(null)

  const { getAllBrandsQuery, allBrands, totalBrand } = useAllBrands()

  const analyticCards = React.useMemo(
    () => [
      {
        Icon: Goal,
        strongText: 'Tổng cộng',
        mainNumber: totalBrand,
        slimText: 'thương hiệu có trên hệ thống.'
      }
    ],
    [totalBrand]
  )

  const deleteBrandMutation = useMutation({
    mutationKey: ['deleteBrand'],
    mutationFn: brandsApis.deleteBrand,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getAllBrandsQuery.refetch()
    }
  })

  const handleDeleteBrand = (brandId: string | null) => {
    if (!brandId) return
    deleteBrandMutation.mutate(brandId)
  }

  return (
    <React.Fragment>
      <div className='space-y-5'>
        {/* ANALYTIC CARDS */}
        <div className='grid grid-cols-12 gap-5'>
          {analyticCards.map(({ Icon, mainNumber, slimText, strongText }, index) => (
            <div key={index} className='col-span-3'>
              <AnalyticsCard Icon={Icon} mainNumber={mainNumber} slimText={slimText} strongText={strongText} />
            </div>
          ))}
        </div>
        {/* BUTTONS GROUP */}
        <div className='flex justify-end'>
          <Button size='sm' onClick={() => setIsOpenCreateBrandDialog(true)}>
            <CirclePlus size={16} strokeWidth={1.5} className='mr-2' />
            Thêm thương hiệu mới
          </Button>
        </div>
        {/* TABLE DATA */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách thương hiệu</CardTitle>
            <CardDescription>Có {totalBrand} thương hiệu trên hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminBrandContext.Provider
              value={{
                setCurrentDeletedBrandId,
                setCurrentUpdatedBrandId
              }}
            >
              <DataTable columns={columns} data={allBrands} searchField='name' />
            </AdminBrandContext.Provider>
          </CardContent>
        </Card>
      </div>
      {/* CREATE BRAND DIALOG */}
      <Dialog open={isOpenCreateBrandDialog} onOpenChange={(value) => setIsOpenCreateBrandDialog(value)}>
        <DialogContent className='max-h-screen overflow-y-auto max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Tạo thương hiệu mới</DialogTitle>
          </DialogHeader>
          <CreateBrandForm onCreateSuccess={() => setIsOpenCreateBrandDialog(false)} />
        </DialogContent>
      </Dialog>
      {/* UPDATE BRAND DIALOG */}
      <Dialog
        open={!!currentUpdatedBrandId}
        onOpenChange={(value) => {
          if (!value) {
            setCurrentUpdatedBrandId(null)
          }
        }}
      >
        <DialogContent className='max-h-screen overflow-y-auto max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Cập nhật thương hiệu</DialogTitle>
          </DialogHeader>
          <CreateBrandForm brandId={currentUpdatedBrandId || undefined} />
        </DialogContent>
      </Dialog>
      {/* DELETE BRAND ALERT DIALOG */}
      <AlertDialog
        open={!!currentDeletedBrandId}
        onOpenChange={(value) => {
          if (!value) {
            !deleteBrandMutation.isPending && setCurrentDeletedBrandId(null)
          }
        }}
      >
        <AlertDialogContent className='max-w-sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vĩnh viễn thương hiệu?</AlertDialogTitle>
            <AlertDialogDescription>Thương hiệu sẽ bị xóa vĩnh viễn và không thể khôi phục lại.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteBrandMutation.isPending}
              onClick={() => handleDeleteBrand(currentDeletedBrandId)}
            >
              {deleteBrandMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
