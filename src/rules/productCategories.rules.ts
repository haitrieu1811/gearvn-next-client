import z from 'zod'

import { ProductCategoryStatus } from '@/constants/enum'
import { NUMBER_REGEX } from '@/constants/regex'

export const productCategorySchema = z.object({
  name: z.string().min(1, 'Tên danh mục sản phẩm là bắt buộc.'),
  description: z.string().optional(),
  status: z
    .enum([ProductCategoryStatus.Active.toString(), ProductCategoryStatus.Inactive.toString()], {
      message: 'Trạng thái danh mục sản phẩm không hợp lệ'
    })
    .optional(),
  orderNumber: z.string().regex(NUMBER_REGEX, 'Thứ tự sắp xếp phải là một số nguyên.')
})

export const createProductCategorySchema = productCategorySchema.pick({
  name: true,
  description: true,
  status: true,
  orderNumber: true
})

export type CreateProductCategorySchema = z.infer<typeof createProductCategorySchema>
