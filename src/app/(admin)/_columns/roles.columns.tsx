/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table'
import { Ellipsis, PencilLine, PlusCircle, TableProperties, Trash2 } from 'lucide-react'
import moment from 'moment'
import React from 'react'

import CreateRoleForm from '@/app/(admin)/_components/create-role-form'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { FacetedFilter } from '@/components/data-table/data-table-toolbar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { RoleField, RoleType } from '@/constants/enum'
import { convertMomentToVietnamese } from '@/lib/utils'
import { RoleItem } from '@/types/roles.types'

export const roleTypeEnumToString = {
  [RoleType.Create]: 'Thêm',
  [RoleType.Read]: 'Đọc',
  [RoleType.Update]: 'Sửa',
  [RoleType.Delete]: 'Xóa'
} as const

export const roleFieldEnumToString = {
  [RoleField.Product]: 'Sản phẩm',
  [RoleField.Post]: 'Bài viết',
  [RoleField.Order]: 'Đơn hàng'
} as const

export const facetedFilter: FacetedFilter[] = [
  {
    title: 'Loại vai trò',
    column: 'type',
    options: [
      {
        icon: PlusCircle,
        label: 'Thêm',
        value: RoleType.Create.toString()
      },
      {
        icon: TableProperties,
        label: 'Đọc',
        value: RoleType.Read.toString()
      },
      {
        icon: PencilLine,
        label: 'Sửa',
        value: RoleType.Update.toString()
      },
      {
        icon: Trash2,
        label: 'Xóa',
        value: RoleType.Delete.toString()
      }
    ]
  }
]

export const columns: ColumnDef<RoleItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên vai trò' />
  },
  {
    accessorKey: 'type',
    header: () => <div className='text-xs text-muted-foreground'>Loại vai trò</div>,
    cell: ({ row }) => <Badge variant='outline'>{roleTypeEnumToString[row.original.type]}</Badge>
  },
  {
    accessorKey: 'field',
    header: () => <div className='text-xs text-muted-foreground'>Lĩnh vực vai trò</div>,
    cell: ({ row }) => <Badge variant='outline'>{roleFieldEnumToString[row.original.field]}</Badge>
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tạo lúc' />,
    cell: ({ row }) => convertMomentToVietnamese(moment(row.original.createdAt).fromNow())
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tạo lúc' />,
    cell: ({ row }) => convertMomentToVietnamese(moment(row.original.updatedAt).fromNow())
  },
  {
    id: 'actions',
    header: () => <div className='text-xs text-muted-foreground text-right'>Thao tác</div>,
    cell: ({ row }) => {
      const role = row.original

      const [isShowUpdateDialog, setIsShowUpdateDialog] = React.useState<boolean>(false)

      return (
        <div className='flex justify-end'>
          <Dialog open={isShowUpdateDialog} onOpenChange={(value) => setIsShowUpdateDialog(value)}>
            <DialogContent className='max-h-screen overflow-y-auto'>
              <DialogHeader>
                <DialogTitle>Cập nhật vai trò</DialogTitle>
                <DialogDescription>Cập nhật vai trò và gán vai trò đó cho người dùng.</DialogDescription>
              </DialogHeader>
              <CreateRoleForm roleId={role._id} onUpdateSuccess={() => setIsShowUpdateDialog(false)} />
            </DialogContent>
          </Dialog>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='ghost'>
                <Ellipsis size={18} strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setIsShowUpdateDialog(true)}>Cập nhật vai trò</DropdownMenuItem>
              <DropdownMenuItem>Xóa vai trò</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
