'use client'

import { useQuery } from '@tanstack/react-query'
import { PlusCircle, User } from 'lucide-react'
import React from 'react'

import permissionsApis from '@/apis/permissions.apis'
import { columns } from '@/app/(admin)/_columns/permissions.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import CreatePermissionForm from '@/app/(admin)/_components/create-permission-form'
import UpdatePermissionForm from '@/app/(admin)/_components/update-permission-form'
import DataTable from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { UserType } from '@/constants/enum'
import useAllRoles from '@/hooks/useAllRoles'
import useAllUsers from '@/hooks/useAllUsers'

type AdminPermissionContext = {
  currentStaffId: string | null
  setCurrentStaffId: React.Dispatch<React.SetStateAction<string | null>>
}

const initialAdminPermissionContext: AdminPermissionContext = {
  currentStaffId: null,
  setCurrentStaffId: () => null
}

export const AdminPermissionContext = React.createContext(initialAdminPermissionContext)

export default function AdminPermission() {
  const [currentStaffId, setCurrentStaffId] = React.useState<string | null>(null)
  const [isOpenCreatePermissionForm, setIsOpenCreatePermissionForm] = React.useState<boolean>(false)
  const [isOpenUpdatePermissionForm, setIsOpenUpdatePermissionForm] = React.useState<boolean>(false)

  const { analytics } = useAllUsers({ type: UserType.Staff })
  const { totalRole } = useAllRoles()

  const getPermissionsGroupByUserQuery = useQuery({
    queryKey: ['getPermissionsGroupByUser'],
    queryFn: () => permissionsApis.getPermissionsGroupByUser()
  })

  const permissions = React.useMemo(
    () => getPermissionsGroupByUserQuery.data?.data.data.permissions || [],
    [getPermissionsGroupByUserQuery.data?.data.data.permissions]
  )
  const analyticCards = React.useMemo(
    () => [
      {
        icon: <User size={16} strokeWidth={1.5} />,
        strongText: 'Tổng cộng',
        mainNumber: totalRole,
        slimText: 'quyền trên hệ thống'
      },
      {
        icon: <User size={16} strokeWidth={1.5} />,
        strongText: 'Tổng cộng',
        mainNumber: analytics?.totalStaff || 0,
        slimText: 'nhân viên trên hệ thống'
      }
    ],
    [totalRole, analytics?.totalStaff]
  )

  return (
    <div className='space-y-5'>
      {/* ANALYTIC CARDS */}
      <div className='grid grid-cols-12 gap-5'>
        {analyticCards.map((analyticCard, index) => (
          <div key={index} className='col-span-3'>
            <AnalyticsCard
              icon={analyticCard.icon}
              strongText={analyticCard.strongText}
              mainNumber={analyticCard.mainNumber}
              slimText={analyticCard.slimText}
            />
          </div>
        ))}
      </div>
      {/* BUTTONS GROUP */}
      <div className='flex justify-end space-x-2'>
        <Button size='sm' onClick={() => setIsOpenCreatePermissionForm(true)}>
          <PlusCircle size={16} className='mr-2' />
          Phân quyền cho nhân viên
        </Button>
      </div>
      {/* TABLE DATA */}
      <Card>
        <CardHeader>
          <CardTitle>Vai trò của nhân viên</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminPermissionContext.Provider
            value={{
              currentStaffId,
              setCurrentStaffId
            }}
          >
            <DataTable columns={columns} data={permissions} searchField='email' />
          </AdminPermissionContext.Provider>
        </CardContent>
      </Card>
      {/* CREATE PERMISSION DIALOG */}
      <Dialog open={isOpenCreatePermissionForm} onOpenChange={(value) => setIsOpenCreatePermissionForm(value)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Phân quyền cho nhân viên</DialogTitle>
            <DialogDescription>Chọn một nhân viên và bổ sung quyền thích hợp cho nhân viên đó.</DialogDescription>
          </DialogHeader>
          <CreatePermissionForm
            onSuccess={() => {
              setIsOpenCreatePermissionForm(false)
              getPermissionsGroupByUserQuery.refetch()
            }}
          />
        </DialogContent>
      </Dialog>
      {/* UPDATE PERMISSION DIALOG */}
      <Dialog
        open={!!currentStaffId || isOpenUpdatePermissionForm}
        onOpenChange={(value) => {
          setIsOpenUpdatePermissionForm(value)
          if (!value) setCurrentStaffId(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cập nhật vai trò người dùng</DialogTitle>
          </DialogHeader>
          <UpdatePermissionForm userId={currentStaffId} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
