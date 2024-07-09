'use client'

import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

import CreateProductForm from '@/app/(admin)/_components/create-product-form'
import { Button } from '@/components/ui/button'

export default function AdminProductNew() {
  const router = useRouter()
  return (
    <div className='space-y-5'>
      <div className='flex items-center space-x-3'>
        <Button type='button' size='icon' variant='outline' className='w-8 h-8' onClick={() => router.back()}>
          <ChevronLeft size={16} />
        </Button>
        <div className='flex items-center space-x-3'>
          <h1 className='text-xl tracking-tight font-semibold'>Tạo sản phẩm mới</h1>
        </div>
      </div>
      <CreateProductForm />
    </div>
  )
}
