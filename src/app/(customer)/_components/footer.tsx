import Image from 'next/image'
import Link from 'next/link'

import pay1 from '@/assets/images/pay_1.webp'
import pay2 from '@/assets/images/pay_2.webp'
import pay3 from '@/assets/images/pay_3.webp'
import pay4 from '@/assets/images/pay_4.webp'
import pay5 from '@/assets/images/pay_5.webp'
import pay6 from '@/assets/images/pay_6.webp'
import pay7 from '@/assets/images/pay_7.webp'
import pay8 from '@/assets/images/pay_8.webp'
import ship1 from '@/assets/images/ship_1.webp'
import ship2 from '@/assets/images/ship_2.webp'
import ship3 from '@/assets/images/ship_3.webp'
import ship4 from '@/assets/images/ship_4.webp'
import PATH from '@/constants/path'

const transporters = [ship1, ship2, ship3, ship4] as const
const paymentMethods = [pay1, pay2, pay3, pay4, pay5, pay6, pay7, pay8] as const

const FOOTER_LINKS = [
  {
    header: 'Về Gearvn',
    items: [
      {
        href: PATH.HOME,
        name: 'Giới thiệu'
      },
      {
        href: PATH.HOME,
        name: 'Tuyển dụng'
      }
    ]
  },
  {
    header: 'Chính sách',
    items: [
      {
        href: PATH.HOME,
        name: 'Chính sách bảo hành'
      },
      {
        href: PATH.HOME,
        name: 'Chính sách Thanh toán'
      },
      {
        href: PATH.HOME,
        name: 'Chính sách giao hàng'
      },
      {
        href: PATH.HOME,
        name: 'Chính sách bảo mật'
      }
    ]
  },
  {
    header: 'Thông tin',
    items: [
      {
        href: PATH.HOME,
        name: 'Hệ thống cửa hàng'
      },
      {
        href: PATH.HOME,
        name: 'Hướng dẫn mua hàng'
      },
      {
        href: PATH.HOME,
        name: 'Tra cứu địa chỉ bảo hành'
      }
    ]
  }
] as const

export default function CustomerFooter() {
  return (
    <footer className='bg-background'>
      <div className='max-w-6xl mx-auto'>
        <div className='grid grid-cols-12 gap-5 py-10'>
          {FOOTER_LINKS.map((item, index) => (
            <div key={index} className='col-span-2'>
              <h3 className='font-semibold'>{item.header}</h3>
              <ul className='mt-2'>
                {item.items.map((_item, _index) => (
                  <li key={_index}>
                    <Link href={_item.href} className='text-sm leading-loose hover:underline'>
                      {_item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className='col-span-3'>
            <h3 className='font-semibold'>Tổng đài hỗ trợ</h3>
            <ul className='mt-2'>
              {[
                {
                  text: 'Mua hàng:',
                  linkName: '1900.5310',
                  href: PATH.HOME
                },
                {
                  text: 'Bảo hành:',
                  linkName: '1900.5325',
                  href: PATH.HOME
                },
                {
                  text: 'Khiếu nại:',
                  linkName: '1800.6173',
                  href: PATH.HOME
                },
                {
                  text: 'Email:',
                  linkName: 'cskh@gearvn.com',
                  href: PATH.HOME
                }
              ].map((item, index) => (
                <li key={index} className='text-sm leading-loose flex items-center space-x-2'>
                  <span>{item.text}</span>
                  <Link href={item.href} className='text-blue-500 font-bold'>
                    {item.linkName}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className='col-span-3'>
            <h3 className='font-semibold'>Đơn vị vận chuyển</h3>
            <div className='grid grid-cols-12 gap-1 mt-3'>
              {transporters.map((item, index) => (
                <div key={index} className='col-span-3'>
                  <Image width={100} height={100} src={item} alt='' />
                </div>
              ))}
            </div>
            <h3 className='font-semibold mt-5'>Cách thức thanh toán</h3>
            <div className='grid grid-cols-12 gap-1 mt-3'>
              {paymentMethods.map((item, index) => (
                <div key={index} className='col-span-3'>
                  <Image width={100} height={100} src={item} alt='' />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
