'use client'

import { PlusCircle } from 'lucide-react'
import React from 'react'

import CreateAddressForm from '@/app/(customer)/_components/create-address-form'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'

export default function AccountAddress() {
  const [isOpenCreateAddressDialog, setIsOpenCreateAddressDialog] = React.useState<boolean>(false)
  return (
    <React.Fragment>
      <Card className='rounded-md shadow-none border-0'>
        <CardHeader className='flex-row space-y-0 justify-between items-center'>
          <CardTitle className='text-2xl'>Số địa chỉ</CardTitle>
          <Button size='sm' onClick={() => setIsOpenCreateAddressDialog(true)}>
            <PlusCircle size={16} className='mr-2' />
            Thêm địa chỉ mới
          </Button>
        </CardHeader>
        <CardContent>
          {Array(5)
            .fill(0)
            .map((_, index) => (
              <div key={index} className='flex items-center space-x-10 py-4 border-t first:border-t-0'>
                <div className='flex-1 space-y-1'>
                  <div className='flex items-center text-[15px]'>
                    {index === 0 && (
                      <Badge variant='outline' className='mr-2 border-main text-main'>
                        Mặc định
                      </Badge>
                    )}
                    <div className='font-medium'>Trần Hải Triều</div>
                    <Separator className='mx-2 w-0.5 h-4' />
                    <div className='text-muted-foreground'>0775939704</div>
                  </div>
                  <div className='text-sm text-muted-foreground'>
                    24, Xã Biển Hồ, Thành phố Pleiku, Gia Lai, Vietnam
                  </div>
                </div>
                <div className='flex flex-col items-center'>
                  <div className='flex space-x-4'>
                    <Button variant='link' size='sm' className='p-0'>
                      Cập nhật
                    </Button>
                    <Button variant='link' size='sm' className='p-0'>
                      Xóa
                    </Button>
                  </div>
                  <Button variant='outline' size='sm'>
                    Thiết lập mặc định
                  </Button>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
      {/* CREATE ADDRESS DIALOG */}
      <Dialog open={isOpenCreateAddressDialog} onOpenChange={(value) => setIsOpenCreateAddressDialog(value)}>
        <DialogContent className='max-h-screen overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Thêm địa chỉ mới</DialogTitle>
          </DialogHeader>
          <CreateAddressForm onSuccess={() => setIsOpenCreateAddressDialog(false)} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
