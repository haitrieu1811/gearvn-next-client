'use client'

import { useQuery } from '@tanstack/react-query'
import { Map, PlusCircle } from 'lucide-react'
import React from 'react'

import rolesApis from '@/apis/roles.apis'
import { columns, facetedFilter } from '@/app/(admin)/_columns/roles.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import CreateRoleForm from '@/app/(admin)/_components/create-role-form'
import DataTable from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export default function AdminRole() {
  const [isShowCreateDialog, setIsShowCreateDialog] = React.useState<boolean>(false)

  const getAllRolesQuery = useQuery({
    queryKey: ['getAllRoles'],
    queryFn: () => rolesApis.getAll()
  })

  const allRoles = React.useMemo(
    () => getAllRolesQuery.data?.data.data.roles || [],
    [getAllRolesQuery.data?.data.data.roles]
  )
  const totalRole = React.useMemo(
    () => getAllRolesQuery.data?.data.data.pagination.totalRows || 0,
    [getAllRolesQuery.data?.data.data.pagination.totalRows]
  )

  return (
    <div className='space-y-5'>
      <Dialog open={isShowCreateDialog} onOpenChange={(value) => setIsShowCreateDialog(value)}>
        <DialogContent className='max-h-screen overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Thêm vai trò mới</DialogTitle>
            <DialogDescription>Thêm vai trò mới và gán vai trò đó cho người dùng.</DialogDescription>
          </DialogHeader>
          <CreateRoleForm onCreateSuccess={() => setIsShowCreateDialog(false)} />
        </DialogContent>
      </Dialog>
      <div className='grid grid-cols-12 gap-5'>
        <div className='col-span-3'>
          <AnalyticsCard
            icon={<Map strokeWidth={1.5} size={16} />}
            mainNumber={totalRole}
            strongText='Có tổng cộng'
            slimText='vai trò trên hệ thống'
          />
        </div>
      </div>
      <div className='flex justify-end'>
        <Button size='sm' onClick={() => setIsShowCreateDialog(true)}>
          <PlusCircle size={16} strokeWidth={1.5} className='mr-2' />
          Thêm vai trò mới
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Danh sách vài trò</CardTitle>
          <CardDescription>Có {totalRole} vai trò trên hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={allRoles} searchField='name' facetedFilter={facetedFilter} />
        </CardContent>
      </Card>
    </div>
  )
}
