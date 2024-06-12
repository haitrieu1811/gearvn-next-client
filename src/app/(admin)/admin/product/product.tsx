'use client'

import { PlusCircle, Tag } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

import { columns } from '@/app/(admin)/_columns/products.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import DataTable from '@/components/data-table'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'

import useAllProducts from '@/hooks/useAllProducts'

export default function AdminProduct() {
  const { totalProduct, allProducts } = useAllProducts()

  const analyticCards = React.useMemo(
    () => [
      {
        Icon: Tag,
        mainNumber: totalProduct,
        strongText: 'Tổng cộng',
        slimText: 'sản phẩm trên hệ thống'
      }
    ],
    [totalProduct]
  )

  return (
    <div className='space-y-5'>
      {/* ANALYTIC CARDS */}
      <div className='grid grid-cols-12 gap-5'>
        {analyticCards.map((analyticCard, index) => (
          <div key={index} className='col-span-3'>
            <AnalyticsCard
              Icon={analyticCard.Icon}
              mainNumber={analyticCard.mainNumber}
              strongText={analyticCard.strongText}
              slimText={analyticCard.slimText}
            />
          </div>
        ))}
      </div>
      {/* BUTTONS GROUP */}
      <div className='flex justify-end'>
        <Button asChild size='sm'>
          <Link href={PATH.ADMIN_PRODUCT_NEW}>
            <PlusCircle size={16} className='mr-2' />
            Thêm sản phẩm mới
          </Link>
        </Button>
      </div>
      {/* DATA TABLE */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách sản phẩm</CardTitle>
          <CardDescription>Có {totalProduct} sản phẩm trên hệ thống</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={allProducts} searchField='name' />
        </CardContent>
      </Card>
    </div>
  )
}
