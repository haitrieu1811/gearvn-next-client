/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import moment from 'moment'
import React from 'react'

import { AdminOrderContext } from '@/app/(admin)/admin/order/order'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { OrderStatus } from '@/constants/enum'
import { convertMomentToVietnamese } from '@/lib/utils'
import { OrderItem } from '@/types/orders.types'

export const ORDER_BADGE = {
  [OrderStatus.InCart]: <div />,
  [OrderStatus.WaitForConfirmation]: <Badge className='bg-yellow-500'>Chờ xác nhận</Badge>,
  [OrderStatus.Confirmed]: <Badge className='bg-blue-500'>Đã xác nhận</Badge>,
  [OrderStatus.Delivering]: <Badge className='bg-blue-500'>Đang vận chuyển</Badge>,
  [OrderStatus.Delivered]: <Badge className='bg-green-500'>Đã giao</Badge>,
  [OrderStatus.Cancelled]: <Badge className='bg-red-500'>Đã hủy</Badge>
} as const

export const columns: ColumnDef<OrderItem>[] = [
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
    accessorKey: '_id',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Mã đơn hàng' />
  },
  {
    accessorKey: 'fullName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Người đặt' />
  },
  {
    accessorKey: 'phoneNumber',
    header: () => <div className='text-xs text-muted-foreground'>Số điện thoại</div>,
    enableHiding: false,
    enableSorting: false
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Đặt lúc' />,
    cell: ({ row }) => convertMomentToVietnamese(moment(row.original.createdAt).fromNow())
  },
  {
    accessorKey: 'status',
    header: () => <div className='text-xs text-muted-foreground'>Trạng thái</div>,
    cell: ({ row }) => ORDER_BADGE[row.original.status],
    enableHiding: false,
    enableSorting: false
  },
  {
    id: 'actions',
    header: () => <div className='text-xs text-muted-foreground text-right'>Thao tác</div>,
    cell: ({ row }) => {
      const { setCurrentViewingOrderId, setCurrentDeletingOrderId } = React.useContext(AdminOrderContext)
      return (
        <div className='flex justify-end'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='ghost'>
                <Ellipsis size={18} strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem onClick={() => setCurrentViewingOrderId(row.original._id)}>Xem</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentDeletingOrderId(row.original._id)}>Xóa</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
