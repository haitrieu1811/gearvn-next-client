'use client'

import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'

export default function Back() {
  const router = useRouter()
  const pathname = usePathname()

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (pathname !== PATH.CART) {
      e.preventDefault()
      router.back()
    }
  }

  return (
    <Button asChild variant='ghost'>
      <Link href={PATH.PRODUCT} className='text-blue-500 hover:text-blue-600' onClick={handleBack}>
        <ChevronLeft className='w-4 h-4 mr-2' />
        {pathname === PATH.CART ? 'Mua thêm sản phẩm khác' : 'Trở về'}
      </Link>
    </Button>
  )
}
