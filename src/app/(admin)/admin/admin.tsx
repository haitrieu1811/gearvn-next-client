'use client'

import { Clock } from 'lucide-react'
import Link from 'next/link'

import { columns } from '@/app/(admin)/_columns/orders.columns'
import DataTable from '@/components/data-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'
import isAuthWithAdmin from '@/hocs/isAuthWithAdmin'
import useAllOrders from '@/hooks/useAllOrders'

const TODOS = [
  {
    href: PATH.ADMIN_ORDER,
    value: 1,
    label: 'Đơn hàng cần được xác nhận'
  },
  {
    href: PATH.ADMIN_PRODUCT,
    value: 2,
    label: 'Sản phẩm cần được phê duyệt'
  },
  {
    href: PATH.ADMIN_POST,
    value: 18,
    label: 'Bài viết cần được phê duyệt'
  }
] as const

const HOME_NOTIFICATIONS = [
  {
    title: 'HẠ NHIỆT PHÍ SHIP THÁNG 07/2024 TẠI SPX',
    description:
      'CHỌN SPX, HẠ NHIỆT PHÍ SHIP THÁNG 7 🌈GIẢM 3.000Đ CHO ĐƠN HÀNG TRÊN TOÀN QUỐC 🔥 ƯU ĐÃI từ 01.07 - 14.07 👉 LÊN ĐƠN NGAY TẠI WEBSITE SPX.VN SPX GIAO LÀ THÍCH, HỖ TRỢ NHIỆT TÌNH, GIÁ CƯỚC ƯU ĐÃI!',
    createdAt: '1 giờ trước'
  },
  {
    title: 'Cơ hội nhận quà cuối tháng Shop ơi!',
    description:
      '🎁 Thử thách ""Thánh chia sẻ"" dành cho ai? - Thành viên chăm chỉ đăng bài và tương tác nhiệt tình trên nhóm. - Thành viên muốn nhận phần thưởng hấp dẫn cuối tháng. 👉Duy nhất chỉ có tại Cộng đồng ""Lập nghiệp với Shopee"", tham gia ngay!',
    createdAt: '2 giờ trước'
  },
  {
    title: 'Bảng xếp hạng SSP tháng 06',
    description: '🎉VINH DANH CÁC ĐỐI TÁC CUNG CẤP DỊCH VỤ CHIẾN LƯỢC CỦA SHOPEE (SSP) THÁNG 06/2024🎉 Xem thêm 👉',
    createdAt: '12 giờ trước'
  }
] as const

export default isAuthWithAdmin(function Admin() {
  const { orders } = useAllOrders()

  return (
    <div className='grid grid-cols-12 gap-5'>
      <div className='col-span-8'>
        <div className='grid gap-5'>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Danh sách việc cần làm</CardTitle>
              <CardDescription>Những việc bạn sẽ phải làm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-12 gap-5'>
                {TODOS.map((todo) => (
                  <Link
                    key={todo.label}
                    href={todo.href}
                    className='col-span-3 flex flex-col justify-center items-center space-y-1 border rounded-lg p-6 hover:bg-muted'
                  >
                    <span className='font-semibold'>{todo.value}</span>
                    <span className='text-sm text-muted-foreground text-center capitalize'>{todo.label}</span>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className='text-xl'>Đơn hàng hôm nay</CardTitle>
              <CardDescription>Hôm nay có 10 đơn hàng</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable columns={columns} data={orders} />
            </CardContent>
          </Card>
        </div>
      </div>
      <div className='col-span-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-xl'>Thông báo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='space-y-5'>
              {HOME_NOTIFICATIONS.map((item) => (
                <div key={item.title} className='space-y-2 text-sm'>
                  <div className='flex flex-col space-y-1 group'>
                    <Link href={PATH.HOME} className='font-semibold group-hover:underline'>
                      {item.title}
                    </Link>
                    <Link href={PATH.HOME} className='text-muted-foreground group-hover:underline'>
                      {item.description}
                    </Link>
                  </div>
                  <div className='flex items-center space-x-2 text-muted-foreground'>
                    <Clock size={16} strokeWidth={1.5} />
                    <p>{item.createdAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
})
