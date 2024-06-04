import Tippy from '@tippyjs/react/headless'
import { Hand, User } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'

export default function CustomerHeaderAuth() {
  return (
    <React.Fragment>
      <Tippy
        interactive
        placement='bottom-end'
        offset={[0, 10]}
        zIndex={9}
        render={() => (
          <div className='bg-background rounded-md shadow-sm border p-4 w-[300px]'>
            <div className='flex items-center space-x-4'>
              <Hand />
              <div className='text-sm'>Xin chào, vui lòng đăng nhập</div>
            </div>
            <div className='flex space-x-3 mt-6'>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className='flex-auto uppercase'>Đăng nhập</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Đăng nhập</DialogTitle>
                    <DialogDescription>Nhập thông tin tài khoản bên dưới để đăng nhập vào hệ thống.</DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
              <Button variant='outline' className='flex-auto uppercase'>
                Đăng ký
              </Button>
            </div>
          </div>
        )}
      >
        <div className='flex items-center space-x-2 text-white bg-main-foreground h-10 px-2 rounded-md hover:cursor-pointer'>
          <User />
          <div className='text-[13px] font-medium leading-tight'>
            <div>Đăng</div>
            <div>nhập</div>
          </div>
        </div>
      </Tippy>
    </React.Fragment>
  )
}
