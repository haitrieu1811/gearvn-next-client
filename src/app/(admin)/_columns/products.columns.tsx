/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { AdminProductContext } from '@/app/(admin)/admin/product/product'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { ProductApprovalStatus, ProductStatus } from '@/constants/enum'
import PATH from '@/constants/path'
import { formatCurrency } from '@/lib/utils'
import { ProductItem } from '@/types/products.types'

export const statuses = {
  [ProductStatus.Active]: (
    <Badge variant='outline' className='border-green-500 text-green-500'>
      Đang hoạt động
    </Badge>
  ),
  [ProductStatus.Inactive]: (
    <Badge variant='outline' className='border-red-500 text-red-500'>
      Không hoạt động
    </Badge>
  )
} as const

export const approvalStatuses = {
  [ProductApprovalStatus.Approved]: (
    <Badge variant='outline' className='border-green-500 text-green-500'>
      Đã duyệt
    </Badge>
  ),
  [ProductApprovalStatus.Unapproved]: (
    <Badge variant='outline' className='border-yellow-500 text-yellow-500'>
      Chưa duyệt
    </Badge>
  )
} as const

export const columns: ColumnDef<ProductItem>[] = [
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
    accessorKey: 'thumbnail',
    header: () => '',
    cell: ({ row }) => (
      <Image
        width={100}
        height={100}
        src={row.original.thumbnail.url}
        alt={row.original.name}
        className='object-cover rounded-lg aspect-square w-16 h-16'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'name',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tên sản phẩm' />
  },
  {
    accessorKey: 'priceAfterDiscount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Giá hiện tại' />,
    cell: ({ row }) => formatCurrency(row.original.priceAfterDiscount)
  },
  {
    accessorKey: 'category',
    header: () => <div className='text-xs text-muted-foreground'>Danh mục</div>,
    cell: ({ row }) => <Badge variant='outline'>{row.original.category.name}</Badge>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'brand',
    header: () => <div className='text-xs text-muted-foreground'>Thương hiệu</div>,
    cell: ({ row }) => <Badge variant='outline'>{row.original.brand.name}</Badge>,
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'status',
    header: () => <div className='text-xs text-muted-foreground'>Trạng thái</div>,
    cell: ({ row }) => statuses[row.original.status],
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'approvalStatus',
    header: () => <div className='text-xs text-muted-foreground'>Phê duyệt</div>,
    cell: ({ row }) => approvalStatuses[row.original.approvalStatus],
    enableSorting: false,
    enableHiding: false
  },
  {
    id: 'actions',
    header: () => <div className='text-xs text-muted-foreground text-right'>Thao tác</div>,
    cell: ({ row }) => {
      const { setCurrentDeletedProductId } = React.useContext(AdminProductContext)
      return (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='ghost'>
                <Ellipsis size={18} strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem asChild>
                <Link href={PATH.ADMIN_PRODUCT_UPDATE(row.original._id)}>Chi tiết</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentDeletedProductId(row.original._id)}>
                Xóa vĩnh viễn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
