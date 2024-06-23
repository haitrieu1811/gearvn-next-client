import { BadgeInfo, Fullscreen, ShieldCheck, ShoppingBag } from 'lucide-react'
import React from 'react'

import Back from '@/app/(customer)/cart/back'
import { cn } from '@/lib/utils'
import CheckoutProvider from '@/providers/checkout.provider'

const STEPS = [
  {
    icon: ShoppingBag,
    name: 'Giỏ hàng'
  },
  {
    icon: BadgeInfo,
    name: 'Thông tin đặt hàng'
  },
  {
    icon: Fullscreen,
    name: 'Xem lại đơn hàng'
  },
  {
    icon: ShieldCheck,
    name: 'Hoàn tất'
  }
] as const

export default function CartLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <CheckoutProvider>
      <div className='py-5'>
        <div className='w-[600px] mx-auto space-y-2'>
          <Back />
          <div className='bg-background rounded-md shadow-sm p-2'>
            {/* STEPS */}
            <div className='flex bg-rose-50 p-5 rounded-md'>
              {STEPS.map((step, index) => {
                const isActive = index === 0
                return (
                  <div
                    key={step.name}
                    className='flex-auto flex flex-col justify-center items-center space-y-1 relative before:absolute before:top-3.5 before:left-0 before:right-0 before:h-px before:bg-muted-foreground'
                  >
                    <div
                      className={cn('w-7 h-7 rounded-full flex justify-center items-center border relative z-[1]', {
                        'bg-main border-main': isActive,
                        'bg-rose-50 border-muted-foreground': !isActive
                      })}
                    >
                      <step.icon
                        size={16}
                        className={cn({
                          'fill-white stroke-main': isActive,
                          'fill-rose-50 stroke-muted-foreground': !isActive
                        })}
                      />
                    </div>
                    <div
                      className={cn('text-sm', {
                        'text-main': isActive,
                        'text-muted-foreground': !isActive
                      })}
                    >
                      {step.name}
                    </div>
                  </div>
                )
              })}
            </div>
            {children}
          </div>
        </div>
      </div>
    </CheckoutProvider>
  )
}
