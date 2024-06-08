'use client'

import { Dumbbell, Headset, PlusCircle, UserRound, UsersRound } from 'lucide-react'
import React from 'react'

import { columns, facetedFilter } from '@/app/(admin)/_columns/users.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import CreateUserForm from '@/app/(admin)/_components/create-user-form'
import DataTable from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useAllUsers from '@/hooks/useAllUsers'

export default function AdminUser() {
  const [isOpenCreateUserDialog, setIsOpenCreateUserDialog] = React.useState<boolean>(false)

  const { allUsers, analytics, getAllUsersQuery } = useAllUsers({})

  const analyticCards = React.useMemo(
    () => [
      {
        icon: UsersRound,
        mainNumber: analytics?.totalUsers || 0,
        strongText: 'Tổng cộng',
        slimText: 'có trên hệ thống'
      },
      {
        icon: Dumbbell,
        mainNumber: analytics?.totalAdmin || 0,
        strongText: 'Tổng cộng',
        slimText: 'admin có trên hệ thống'
      },
      {
        icon: Headset,
        mainNumber: analytics?.totalStaff || 0,
        strongText: 'Tổng cộng',
        slimText: 'nhân viên có trên hệ thống'
      },
      {
        icon: UserRound,
        mainNumber: analytics?.totalCustomer || 0,
        strongText: 'Tổng cộng',
        slimText: 'khách hàng có trên hệ thống'
      }
    ],
    [analytics]
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
          <Button size='sm' onClick={() => setIsOpenCreateUserDialog(true)}>
            <PlusCircle size={16} className='mr-2' />
            Thêm người dùng
          </Button>
        </div>
        {/* TABLE DATA */}
        <Card className='mt-5'>
          <CardHeader>
            <CardTitle>Danh sách người dùng</CardTitle>
            <CardDescription>Có {analytics?.totalUsers} người dùng trên hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable columns={columns} data={allUsers} searchField='email' facetedFilter={facetedFilter} />
          </CardContent>
        </Card>
      </div>
      {/* CREATE USER DIALOG */}
      <Dialog open={isOpenCreateUserDialog} onOpenChange={(value) => setIsOpenCreateUserDialog(value)}>
        <DialogContent className='max-h-screen overflow-y-auto max-w-xl'>
          <DialogHeader>
            <DialogTitle>Tạo nhân viên mới</DialogTitle>
            <DialogDescription>
              Nhân viên được tạo sẽ không cần phải thực hiện bước xác minh tài khoản bằng email.
            </DialogDescription>
          </DialogHeader>
          <CreateUserForm
            onSuccess={() => {
              setIsOpenCreateUserDialog(false)
              getAllUsersQuery.refetch()
            }}
          />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
