import { ColumnDef } from '@tanstack/react-table'
import { Dog, Dumbbell, Ellipsis, Headset, ShieldBan, ShieldCheck, Squirrel, UserRound } from 'lucide-react'
import moment from 'moment'

import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { FacetedFilter } from '@/components/data-table/data-table-toolbar'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Gender, UserStatus, UserType } from '@/constants/enum'
import { convertMomentToVietnamese } from '@/lib/utils'
import { UserItem } from '@/types/users.types'

const gendersEnumToString = {
  [Gender.Male]: 'Nam',
  [Gender.Female]: 'Nữ',
  [Gender.Other]: 'Khác'
} as const

const userTypesEnumToString = {
  [UserType.Admin]: 'Admin',
  [UserType.Staff]: 'Nhân viên',
  [UserType.Customer]: 'Khách hàng'
} as const

const userStatusesEnumToString = {
  [UserStatus.Active]: 'Đang hoạt động',
  [UserStatus.Inactive]: 'Ngừng hoạt động'
}

export const facetedFilter: FacetedFilter[] = [
  {
    title: 'Giới tính',
    column: 'gender',
    options: [
      {
        icon: Squirrel,
        label: 'Nam',
        value: Gender.Male.toString()
      },
      {
        icon: Dog,
        label: 'Nữ',
        value: Gender.Female.toString()
      }
    ]
  },
  {
    title: 'Loại tài khoản',
    column: 'type',
    options: [
      {
        icon: Dumbbell,
        label: 'Admin',
        value: UserType.Admin.toString()
      },
      {
        icon: Headset,
        label: 'Nhân viên',
        value: UserType.Staff.toString()
      },
      {
        icon: UserRound,
        label: 'Khách hàng',
        value: UserType.Customer.toString()
      }
    ]
  },
  {
    title: 'Trạng thái hoạt động',
    column: 'status',
    options: [
      {
        icon: ShieldCheck,
        label: 'Đang hoạt động',
        value: UserStatus.Active.toString()
      },
      {
        icon: ShieldBan,
        label: 'Ngừng hoạt động',
        value: UserStatus.Inactive.toString()
      }
    ]
  }
]

export const columns: ColumnDef<UserItem>[] = [
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
      <div className='flex items-center space-x-3'>
        <Avatar>
          <AvatarImage src={row.original.avatar} />
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
    accessorKey: 'gender',
    header: () => <div className='text-xs text-muted-foreground'>Giới tính</div>,
    cell: ({ row }) => gendersEnumToString[row.original.gender],
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'type',
    header: () => <div className='text-xs text-muted-foreground'>Loại tài khoản</div>,
    cell: ({ row }) => userTypesEnumToString[row.original.type],
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'status',
    header: () => <div className='text-xs text-muted-foreground'>Trạng thái</div>,
    cell: ({ row }) => (
      <Badge variant={row.original.status === UserStatus.Active ? 'outline' : 'destructive'}>
        {userStatusesEnumToString[row.original.status]}
      </Badge>
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tạo lúc' />,
    cell: ({ row }) => convertMomentToVietnamese(moment(row.original.createdAt).fromNow())
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Cập nhật lúc' />,
    cell: ({ row }) => convertMomentToVietnamese(moment(row.original.updatedAt).fromNow())
  },
  {
    id: 'actions',
    header: () => <div className='text-xs text-muted-foreground text-right'>Thao tác</div>,
    cell: () => (
      <div className='flex justify-end'>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button size='icon' variant='ghost'>
              <Ellipsis size={18} strokeWidth={1.5} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            <DropdownMenuItem>Cập nhật</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
  }
]
