/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import moment from 'moment'
import React from 'react'

import { AdminProductCategoryContext } from '@/app/(admin)/admin/product-category/product-category'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ProductCategoryStatus } from '@/constants/enum'
import { convertMomentToVietnamese } from '@/lib/utils'
import { ProductCategoryItem } from '@/types/productCategories.types'

const statusBadges = {
  [ProductCategoryStatus.Active]: (
    <Badge variant='outline' className='border-green-500 text-green-500'>
      Đang hoạt động
    </Badge>
  ),
  [ProductCategoryStatus.Inactive]: (
    <Badge variant='outline' className='border-red-500 text-red-500'>
      Không hoạt động
    </Badge>
  )
} as const

export const columns: ColumnDef<ProductCategoryItem>[] = [
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
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên danh mục sản phẩm' />,
    cell: ({ row }) => (
      <div className='flex items-center space-x-2'>
        <Avatar className='flex-shrink-0'>
          <AvatarImage src={row.original.thumbnail} />
          <AvatarFallback>
            {row.original.name[0].toUpperCase()}
            {row.original.name[1].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>{row.original.name}</div>
      </div>
    )
  },
  {
    accessorKey: 'status',
    header: () => <div>Trạng thái</div>,
    cell: ({ row }) => statusBadges[row.original.status]
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
    cell: ({ row }) => {
      const productCategory = row.original
      const { setCurrentProductCategoryId } = React.useContext(AdminProductCategoryContext)
      return (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='ghost'>
                <Ellipsis size={18} strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setCurrentProductCategoryId(productCategory._id)}>
                Cập nhật
              </DropdownMenuItem>
              <DropdownMenuItem>Xóa vĩnh viên</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
