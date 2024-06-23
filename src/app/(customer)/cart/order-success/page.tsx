import { BadgeCheck } from 'lucide-react'
import { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'

export const metadata: Metadata = {
  title: 'Đặt hàng thành công - GEARVN',
  description: 'Đặt hàng thành công - GEARVN'
}

export default function OrderSuccessPage() {
  return (
    <div className='px-5 py-10'>
      <div className='flex flex-col items-center justify-center space-y-5'>
        <BadgeCheck size={50} strokeWidth={1.5} className='stroke-green-600' />
        <div className='font-semibold text-green-600'>Đặt hàng thành công</div>
        <div className='text-center'>
          <div className='text-sm'>Cảm ơn quý khách đã cho GEARVN có cơ hội được phục vụ.</div>
          <div className='text-sm'>Nhân viên GEARVN sẽ liên hệ với quý khách trong thời gian sớm nhất.</div>
        </div>
        <Button variant='outline' className='border-blue-500 text-blue-500 hover:text-blue-500 hover:bg-blue-50'>
          <Link href={PATH.PRODUCT}>Tiếp tục mua hàng</Link>
        </Button>
      </div>
    </div>
  )
}
