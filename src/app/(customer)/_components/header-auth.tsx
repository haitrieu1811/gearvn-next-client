import Tippy from '@tippyjs/react/headless'
import { BarChartBig, Eye, Hand, LogOut, LucideIcon, NotepadText, User } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import LoginForm from '@/app/(customer)/_components/login-form'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserType } from '@/constants/enum'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import useLogout from '@/hooks/useLogout'
import { AppContext } from '@/providers/app.provider'

type UserActionRef = {
  href: string | null
  name: string
  icon: LucideIcon
  onClick?: () => void
}

export default function CustomerHeaderAuth() {
  const [isShowLoginDialog, setIsShowLoginDialog] = React.useState<boolean>(false)

  const { loggedUser } = React.useContext(AppContext)

  const isClient = useIsClient()
  const { handleLogout } = useLogout()

  const userActionsRef = React.useRef<UserActionRef[]>([
    {
      href: PATH.ACCOUNT_ORDER,
      name: 'Đơn hàng của tôi',
      icon: NotepadText
    },
    {
      href: PATH.HOME,
      name: 'Đã xem gần đây',
      icon: Eye
    },
    {
      href: null,
      name: 'Đăng xuất',
      icon: LogOut,
      onClick: handleLogout
    }
  ])

  return (
    <React.Fragment>
      <Dialog open={isShowLoginDialog} onOpenChange={(value) => setIsShowLoginDialog(value)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đăng nhập</DialogTitle>
            <DialogDescription>Nhập thông tin tài khoản bên dưới để đăng nhập vào hệ thống.</DialogDescription>
          </DialogHeader>
          <LoginForm
            onSuccess={() => {
              setIsShowLoginDialog(false)
            }}
          />
        </DialogContent>
      </Dialog>

      <Tippy
        interactive
        placement='bottom-end'
        offset={[0, 10]}
        zIndex={9}
        render={() => (
          <div className='bg-background rounded-md shadow-sm border w-[300px]'>
            <div className='flex items-center space-x-4 px-4 py-3'>
              <Hand strokeWidth={1.5} />
              {!loggedUser && isClient && <div className='text-sm font-medium'>Xin chào, vui lòng đăng nhập</div>}
              {!!loggedUser && isClient && (
                <Link href={PATH.ACCOUNT} className='text-sm font-medium hover:underline'>
                  Xin chào, {loggedUser.fullName}
                </Link>
              )}
            </div>
            {!loggedUser && (
              <div className='flex space-x-3 mt-6 px-4 pb-4'>
                <Button className='flex-auto uppercase' onClick={() => setIsShowLoginDialog(true)}>
                  Đăng nhập
                </Button>
                <Button variant='outline' className='flex-auto uppercase'>
                  Đăng ký
                </Button>
              </div>
            )}
            {!!loggedUser && isClient && (
              <div className='border-t'>
                {[UserType.Admin, UserType.Staff].includes(loggedUser.type) && (
                  <Link href={PATH.ADMIN} className='flex items-center space-x-2 w-full px-4 py-2.5 hover:underline'>
                    <BarChartBig strokeWidth={1.5} size={20} />
                    <span className='text-sm'>Trang quản trị</span>
                  </Link>
                )}
                {userActionsRef.current.map((userAction, index) => {
                  let Comp: any = 'button'
                  const props: { href?: string } = {}
                  if (!!userAction.href) {
                    Comp = Link
                    props.href = userAction.href
                  }
                  return (
                    <Comp
                      key={index}
                      onClick={userAction.onClick}
                      {...props}
                      className='flex items-center space-x-2 w-full px-4 py-2.5 hover:underline'
                    >
                      <userAction.icon strokeWidth={1.5} size={20} />
                      <span className='text-sm'>{userAction.name}</span>
                    </Comp>
                  )
                })}
              </div>
            )}
          </div>
        )}
      >
        <div className='flex items-center space-x-2 text-white bg-main-foreground h-10 px-2 rounded-md hover:cursor-pointer'>
          <User />
          <div className='text-[13px] font-medium leading-tight'>
            <div>{!!loggedUser && isClient ? 'Xin chào' : 'Đăng'}</div>
            <div>{!!loggedUser && isClient ? loggedUser.fullName : 'nhập'}</div>
          </div>
        </div>
      </Tippy>
    </React.Fragment>
  )
}
