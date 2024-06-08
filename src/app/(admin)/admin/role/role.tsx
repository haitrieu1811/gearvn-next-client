'use client'

import { Map, PlusCircle } from 'lucide-react'
import React from 'react'

import { columns, facetedFilter } from '@/app/(admin)/_columns/roles.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import CreateRoleForm from '@/app/(admin)/_components/create-role-form'
import DataTable from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import useAllRoles from '@/hooks/useAllRoles'

export default function AdminRole() {
  const [isOpenCreateRoleDialog, setIsOpenCreateRoleDialog] = React.useState<boolean>(false)

  const { allRoles, totalRole } = useAllRoles()

  return (
    <React.Fragment>
      <div className='space-y-5'>
        {/* ANALYTIC CARDS */}
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-3'>
            <AnalyticsCard
              Icon={Map}
              mainNumber={totalRole}
              strongText='Có tổng cộng'
              slimText='vai trò trên hệ thống'
            />
          </div>
        </div>
        {/* BUTTONS GROUP */}
        <div className='flex justify-end'>
          <Button size='sm' onClick={() => setIsOpenCreateRoleDialog(true)}>
            <PlusCircle size={16} strokeWidth={1.5} className='mr-2' />
            Thêm vai trò mới
          </Button>
        </div>
        {/* TABLE DATA */}
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
      {/* CREATE ROLE FORM */}
      <Dialog open={isOpenCreateRoleDialog} onOpenChange={(value) => setIsOpenCreateRoleDialog(value)}>
        <DialogContent className='max-h-screen overflow-y-auto'>
          <DialogHeader>
            <DialogTitle>Thêm vai trò mới</DialogTitle>
            <DialogDescription>Thêm vai trò mới và gán vai trò đó cho người dùng.</DialogDescription>
          </DialogHeader>
          <CreateRoleForm onCreateSuccess={() => setIsOpenCreateRoleDialog(false)} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
