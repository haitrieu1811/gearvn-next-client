import z from 'zod'

import { PostStatus } from '@/constants/enum'
import { NUMBER_REGEX } from '@/constants/regex'
import { numberEnumToArray } from '@/lib/utils'

const statuses = numberEnumToArray(PostStatus)

export const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề bài viết là bắt buộc.'),
  description: z.string().min(1, 'Mô tả bài viết là bắt buộc.'),
  content: z.string().min(1, 'Nội dung bài viết là bắt buộc.'),
  orderNumber: z.string().optional(),
  status: z.string().optional()
})

export const createPostSchema = postSchema
  .pick({
    title: true,
    description: true,
    content: true,
    orderNumber: true,
    status: true
  })
  .refine(
    (data) => {
      if (data.orderNumber) {
        return NUMBER_REGEX.test(data.orderNumber)
      }
      return true
    },
    {
      message: 'Thứ tự sắp xếp phải là một số nguyên dương.',
      path: ['orderNumber']
    }
  )
  .refine(
    (data) => {
      if (data.status) {
        return statuses.includes(Number(data.status))
      }
      return true
    },
    {
      message: 'Trạng thái bài viết không hợp lệ.',
      path: ['status']
    }
  )

export type CreatePostSchema = z.infer<typeof createPostSchema>
