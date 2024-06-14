/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table'
import { Ellipsis } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

import { AdminPostContext } from '@/app/(admin)/admin/post/post'
import { DataTableColumnHeader } from '@/components/data-table/data-table-column-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { PostApprovalStatus, PostStatus } from '@/constants/enum'
import PATH from '@/constants/path'
import { PostItem } from '@/types/posts.types'

export const statuses = {
  [PostStatus.Active]: (
    <Badge variant='outline' className='border-green-500 text-green-500'>
      Đang hoạt động
    </Badge>
  ),
  [PostStatus.Inactive]: (
    <Badge variant='outline' className='border-red-500 text-red-500'>
      Không hoạt động
    </Badge>
  )
} as const

export const approvalStatuses = {
  [PostApprovalStatus.Approved]: (
    <Badge variant='outline' className='border-green-500 text-green-500'>
      Đã duyệt
    </Badge>
  ),
  [PostApprovalStatus.Unapproved]: (
    <Badge variant='outline' className='border-yellow-500 text-yellow-500'>
      Chưa duyệt
    </Badge>
  )
} as const

export const columns: ColumnDef<PostItem>[] = [
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
    header: () => <div className='text-xs text-muted-foreground'>Ảnh đại diện</div>,
    cell: ({ row }) => (
      <Image
        width={100}
        height={100}
        src={row.original.thumbnail.url}
        alt={row.original.title}
        className='object-cover rounded-lg aspect-square w-16 h-16'
      />
    ),
    enableSorting: false,
    enableHiding: false
  },
  {
    accessorKey: 'title',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Tiêu đề bài viết' />
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
      const { setCurrentDeletedPostId } = React.useContext(AdminPostContext)
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
                <Link href={PATH.ADMIN_POST_UPDATE(row.original._id)}>Chi tiết</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setCurrentDeletedPostId(row.original._id)}>
                Xóa vĩnh viễn
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    }
  }
]
