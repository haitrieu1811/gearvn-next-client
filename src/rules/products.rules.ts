import z from 'zod'

import { ProductStatus } from '@/constants/enum'
import { NUMBER_REGEX } from '@/constants/regex'

export const productSchema = z.object({
  productCategoryId: z.string().min(1, 'Danh mục sản phẩm là bắt buộc.'),
  brandId: z.string().min(1, 'Thương hiệu là bắt buộc.'),
  name: z.string().min(1, 'Tên sản phẩm là bắt buộc.'),
  originalPrice: z.string().regex(NUMBER_REGEX, 'Giá gốc không hợp lệ.'),
  priceAfterDiscount: z.string().regex(NUMBER_REGEX, 'Giá khuyến mãi không hợp lệ.').optional(),
  shortDescription: z.string().optional(),
  description: z.string().optional(),
  orderNumber: z.string().regex(NUMBER_REGEX, 'Thứ tự sắp xếp phải là một số nguyên dương.'),
  status: z.enum([ProductStatus.Active.toString(), ProductStatus.Inactive.toString()], {
    message: 'Trạng thái sản phẩm không hợp lệ.'
  }),
  specifications: z
    .array(
      z.object({
        key: z.string().min(1, 'Tên thông số kỹ thuật là bắt buộc.'),
        value: z.string().min(1, 'Giá trị thông số kỹ thuật là bắt buộc.')
      })
    )
    .optional()
})

export const createProductSchema = productSchema.pick({
  productCategoryId: true,
  brandId: true,
  name: true,
  originalPrice: true,
  priceAfterDiscount: true,
  shortDescription: true,
  description: true,
  orderNumber: true,
  status: true,
  specifications: true
})

export type CreateProductSchema = z.infer<typeof createProductSchema>
