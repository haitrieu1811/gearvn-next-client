'use client'

import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { LucideIcon } from 'lucide-react'

import { DataTableViewOptions } from '@/components/data-table/data-table-view-options'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DataTableFacetedFilter } from './data-table-faceted-filter'

export type FacetedFilter = {
  title: string
  column: string
  options: {
    value: string
    label: string
    icon: LucideIcon
  }[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchField?: string
  facetedFilter?: FacetedFilter[]
}

export function DataTableToolbar<TData>({ table, searchField, facetedFilter }: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 items-center space-x-2'>
        {!!searchField && (
          <Input
            placeholder='Tìm kiếm...'
            value={(table.getColumn(searchField)?.getFilterValue() as string) ?? ''}
            onChange={(event) => table.getColumn(searchField)?.setFilterValue(event.target.value)}
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        {facetedFilter?.map(
          (item, index) =>
            table.getColumn(item.column) && (
              <DataTableFacetedFilter
                key={index}
                column={table.getColumn(item.column)}
                title={item.title}
                options={item.options}
              />
            )
        )}
        {isFiltered && (
          <Button variant='ghost' onClick={() => table.resetColumnFilters()} className='h-8 px-2 lg:px-3'>
            Đặt lại
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
