import z from 'zod'

import { EMAIL_REGEX } from '@/constants/regex'

export const usersSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc.').regex(EMAIL_REGEX, 'Email không hợp lệ.'),
  password: z.string().min(12, 'Mật khẩu dài tối thiểu 12 ký tự.').max(36, 'Mật khẩu dài tối đa 36 ký tự.')
})

export const loginSchema = usersSchema.pick({
  email: true,
  password: true
})

export type LoginSchema = z.infer<typeof loginSchema>
