import z from 'zod'

import { PaymentMethod } from '@/constants/enum'

export const orderSchema = z.object({
  note: z.string().optional(),
  paymentMethod: z.enum([PaymentMethod.Cash.toString(), PaymentMethod.Banking.toString()], {
    message: 'Phương thức thanh toán không hợp lệ.'
  })
})

export const checkoutSchema = orderSchema.pick({
  note: true,
  paymentMethod: true
})

export type CheckoutSchema = z.infer<typeof checkoutSchema>
