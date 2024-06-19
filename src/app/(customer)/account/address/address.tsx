'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, PlusCircle } from 'lucide-react'
import React from 'react'
import { toast } from 'sonner'

import addressesApis from '@/apis/addresses.apis'
import CreateAddressForm from '@/app/(customer)/_components/create-address-form'
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
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import isAuth from '@/hocs/isAuth'

export default isAuth(function AccountAddress() {
  const [isOpenCreateAddressDialog, setIsOpenCreateAddressDialog] = React.useState<boolean>(false)
  const [currentDeletedAddressId, setCurrentDeletedAddressId] = React.useState<string | null>(null)
  const [currentUpdatedAddressId, setCurrentUpdatedAddressId] = React.useState<string | null>(null)

  const getMyAddressesQuery = useQuery({
    queryKey: ['getMyAddresses'],
    queryFn: () => addressesApis.getMyAddresses()
  })

  const myAddresses = React.useMemo(
    () => getMyAddressesQuery.data?.data.data.addresses || [],
    [getMyAddressesQuery.data?.data.data.addresses]
  )
  const totalMyAddress = React.useMemo(
    () => getMyAddressesQuery.data?.data.data.pagination.totalRows || 0,
    [getMyAddressesQuery.data?.data.data.pagination.totalRows]
  )

  const setDefaultAddressMutation = useMutation({
    mutationKey: ['setDefaultAddress'],
    mutationFn: addressesApis.setDefaultAddress,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getMyAddressesQuery.refetch()
    }
  })

  const deleteAddressMutation = useMutation({
    mutationKey: ['deleteAddress'],
    mutationFn: addressesApis.deleteAddress,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getMyAddressesQuery.refetch()
    }
  })

  return (
    <React.Fragment>
      <Card>
        <CardHeader className='flex-row space-y-0 justify-between items-center'>
          <CardTitle className='text-2xl'>Số địa chỉ</CardTitle>
          <Button size='sm' onClick={() => setIsOpenCreateAddressDialog(true)}>
            <PlusCircle size={16} className='mr-2' />
            Thêm địa chỉ mới
          </Button>
        </CardHeader>
        <CardContent>
          {totalMyAddress > 0 &&
            myAddresses.map((address) => (
              <div key={address._id} className='flex items-center space-x-10 py-4 border-t first:border-t-0'>
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center text-[15px]'>
                    {address.isDefaultAddress && (
                      <Badge variant='outline' className='mr-2 border-main text-main'>
                        Mặc định
                      </Badge>
                    )}
                    <div className='font-medium'>{address.fullName}</div>
                    <Separator className='mx-2 w-0.5 h-4' />
                    <div className='text-muted-foreground'>{address.phoneNumber}</div>
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    {address.detailAddress}, {address.street.prefix} {address.street.name}, {address.ward.prefix}{' '}
                    {address.ward.name}, {address.province.name}
                  </div>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='flex space-x-4'>
                    <Button
                      variant='link'
                      size='sm'
                      className='p-0'
                      onClick={() => setCurrentUpdatedAddressId(address._id)}
                    >
                      Cập nhật
                    </Button>
                    <Button
                      variant='link'
                      size='sm'
                      className='p-0'
                      onClick={() => setCurrentDeletedAddressId(address._id)}
                    >
                      Xóa
                    </Button>
                  </div>
                  <Button
                    variant='outline'
                    size='sm'
                    disabled={setDefaultAddressMutation.isPending || address.isDefaultAddress}
                    onClick={() => setDefaultAddressMutation.mutate(address._id)}
                  >
                    {setDefaultAddressMutation.isPending && (
                      <Loader2 strokeWidth={1.5} className='w-4 h-4 mr-2 animate-spin' />
                    )}
                    Thiết lập mặc định
                  </Button>
                </div>
              </div>
            ))}
          {totalMyAddress === 0 && <div>Chưa có địa chỉ nào.</div>}
        </CardContent>
      </Card>
      {/* CREATE ADDRESS DIALOG */}
      <Dialog open={isOpenCreateAddressDialog} onOpenChange={(value) => setIsOpenCreateAddressDialog(value)}>
        <DialogContent className='max-h-screen overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          </DialogHeader>
          <CreateAddressForm
            onCreateSuccess={() => {
              setIsOpenCreateAddressDialog(false)
              getMyAddressesQuery.refetch()
            }}
          />
        </DialogContent>
      </Dialog>
      {/* UPDATE ADDRESS DIALOG */}
      <Dialog
        open={!!currentUpdatedAddressId}
        onOpenChange={(value) => {
          if (!value) {
            setCurrentUpdatedAddressId(null)
          }
        }}
      >
        <DialogContent className='max-h-screen overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Cập nhật địa chỉ</DialogTitle>
          </DialogHeader>
          <CreateAddressForm
            addressId={currentUpdatedAddressId as string}
            onCreateSuccess={() => {
              getMyAddressesQuery.refetch()
            }}
          />
        </DialogContent>
      </Dialog>
      {/* DELETE ADDRESS ALERT DIALOG */}
      <AlertDialog
        open={!!currentDeletedAddressId}
        onOpenChange={(value) => {
          if (!value) {
            !deleteAddressMutation.isPending && setCurrentDeletedAddressId(null)
          }
        }}
      >
        <AlertDialogContent className='max-w-sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa địa chỉ này?</AlertDialogTitle>
            <AlertDialogDescription>
              Địa chỉ sẽ bị xóa vĩnh viễn và sẽ không được khôi phục sau khi xóa.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction
              disabled={deleteAddressMutation.isPending}
              onClick={() => deleteAddressMutation.mutate(currentDeletedAddressId as string)}
            >
              {deleteAddressMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
})
