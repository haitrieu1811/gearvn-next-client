/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import React from 'react'

import { AdminPermissionContext } from '@/app/(admin)/admin/permission/permission'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PermissionGroupByUser } from '@/types/roles.types'

export const columns: ColumnDef<PermissionGroupByUser>[] = [
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
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' />,
    cell: ({ row }) => (
      <div className='flex items-center space-x-2'>
        <Avatar>
          <AvatarImage src={row.original.avatar} className='object-cover' />
          <AvatarFallback>
            {row.original.fullName[0].toUpperCase()}
            {row.original.fullName[1].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>{row.original.email}</div>
      </div>
    )
  },
  {
    accessorKey: 'roles',
    header: () => <div className='text-xs text-muted-foreground'>Các vai trò</div>,
    cell: ({ row }) => (
      <div className='grid grid-cols-12 gap-2'>
        {row.original.roles.map(({ name, _id }) => (
          <div key={_id} className='col-span-2'>
            <Badge variant='outline'>{name}</Badge>
          </div>
        ))}
      </div>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: () => <div className='text-right text-xs text-muted-foreground'>Thao tác</div>,
    cell: ({ row }) => {
      const { setCurrentStaffId } = React.useContext(AdminPermissionContext)
      return (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon'>
                <Ellipsis size={18} strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setCurrentStaffId(row.original._id)}>Cập nhật</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
