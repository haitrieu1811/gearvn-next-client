import z from 'zod'

import { BrandStatus } from '@/constants/enum'
import { NUMBER_REGEX } from '@/constants/regex'

export const brandSchema = z.object({
  name: z.string().min(1, 'Tên thương hiệu là bắt buộc.'),
  description: z.string().optional(),
  status: z
    .enum([BrandStatus.Active.toString(), BrandStatus.Inactive.toString()], {
      message: 'Trạng thái thương hiệu không hợp lệ.'
    })
    .optional(),
  orderNumber: z.string().regex(NUMBER_REGEX, 'Thứ tự sắp xếp phải là một số nguyên.')
})

export const createBrandSchema = brandSchema.pick({
  name: true,
  description: true,
  status: true,
  orderNumber: true
})

export type CreateBrandSchema = z.infer<typeof createBrandSchema>
