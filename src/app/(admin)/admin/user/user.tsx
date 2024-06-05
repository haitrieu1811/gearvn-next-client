'use client'

import { useQuery } from '@tanstack/react-query'
import { Dumbbell, Headset, PlusCircle, UserRound, UsersRound } from 'lucide-react'
import React from 'react'

import usersApis from '@/apis/users.apis'
import { columns, facetedFilter } from '@/app/(admin)/_columns/users.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import DataTable from '@/components/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function AdminUser() {
  const getAllUsersQuery = useQuery({
    queryKey: ['getAllUsers'],
    queryFn: () => usersApis.getAllUsers()
  })

  const allUsers = React.useMemo(
    () => getAllUsersQuery.data?.data.data.users || [],
    [getAllUsersQuery.data?.data.data.users]
  )

  const analytics = React.useMemo(
    () => getAllUsersQuery.data?.data.data.analytics,
    [getAllUsersQuery.data?.data.data.analytics]
  )

  return (
    <div className='space-y-5'>
      <div className='grid grid-cols-12 gap-5'>
        <div className='col-span-3'>
          <AnalyticsCard
            icon={<UsersRound size={18} strokeWidth={1.5} />}
            mainNumber={analytics?.totalUsers || 0}
            strongText='Tổng cộng'
            slimText='có trên hệ thống'
          />
        </div>
        <div className='col-span-3'>
          <AnalyticsCard
            icon={<Dumbbell size={18} strokeWidth={1.5} />}
            mainNumber={analytics?.totalAdmin || 0}
            strongText='Admin'
            slimText='admin có trên hệ thống'
          />
        </div>
        <div className='col-span-3'>
          <AnalyticsCard
            icon={<Headset size={18} strokeWidth={1.5} />}
            mainNumber={analytics?.totalStaff || 0}
            strongText='Nhân viên'
            slimText='nhân viên có trên hệ thống'
          />
        </div>
        <div className='col-span-3'>
          <AnalyticsCard
            icon={<UserRound size={18} strokeWidth={1.5} />}
            mainNumber={analytics?.totalCustomer || 0}
            strongText='Khách hàng'
            slimText='khách hàng có trên hệ thống'
          />
        </div>
      </div>
      <div className='flex justify-end'>
        <Button size='sm'>
          <PlusCircle size={16} className='mr-2' />
          Thêm người dùng
        </Button>
      </div>
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
  )
}
