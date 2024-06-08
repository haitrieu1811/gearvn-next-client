import z from 'zod'

import { Gender, UserType } from '@/constants/enum'
import { EMAIL_REGEX } from '@/constants/regex'

export const usersSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc.').regex(EMAIL_REGEX, 'Email không hợp lệ.'),
  password: z.string().min(12, 'Mật khẩu dài tối thiểu 12 ký tự.').max(36, 'Mật khẩu dài tối đa 36 ký tự.'),
  confirmPassword: z.string().min(1, 'Nhập lại mật khẩu là bắt buộc.'),
  fullName: z.string().min(1, 'Họ và tên là bắt buộc.'),
  gender: z.enum([Gender.Male.toString(), Gender.Female.toString(), Gender.Other.toString()], {
    message: 'Giới tính không hợp lệ.'
  }),
  type: z.enum([UserType.Staff.toString(), UserType.Customer.toString()], {
    message: 'Giới tính không hợp lệ.'
  })
})

export const loginSchema = usersSchema.pick({
  email: true,
  password: true
})

export const createUserSchema = usersSchema
  .pick({
    email: true,
    fullName: true,
    gender: true,
    type: true,
    password: true,
    confirmPassword: true
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Nhập lại mật khẩu không chính xác.',
    path: ['confirmPassword']
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type CreateUserSchema = z.infer<typeof createUserSchema>
