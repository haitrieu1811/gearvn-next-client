import z from 'zod'

import { Gender, UserType } from '@/constants/enum'
import { EMAIL_REGEX, PHONE_NUMBER_REGEX } from '@/constants/regex'

export const userSchema = z.object({
  email: z.string().min(1, 'Email là bắt buộc.').regex(EMAIL_REGEX, 'Email không hợp lệ.'),
  password: z.string().min(12, 'Mật khẩu dài tối thiểu 12 ký tự.').max(36, 'Mật khẩu dài tối đa 36 ký tự.'),
  confirmPassword: z.string().min(1, 'Nhập lại mật khẩu là bắt buộc.'),
  fullName: z.string().min(1, 'Họ và tên là bắt buộc.'),
  gender: z.enum([Gender.Male.toString(), Gender.Female.toString(), Gender.Other.toString()], {
    message: 'Giới tính không hợp lệ.'
  }),
  type: z.enum([UserType.Staff.toString(), UserType.Customer.toString()], {
    message: 'Giới tính không hợp lệ.'
  }),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, 'Số điện thoại không hợp lệ.')
})

export const loginSchema = userSchema.pick({
  email: true,
  password: true
})

export const registerSchema = userSchema
  .pick({
    fullName: true,
    email: true,
    password: true,
    confirmPassword: true
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Nhập lại mật khẩu không chính xác.',
    path: ['confirmPassword']
  })

export const createUserSchema = userSchema
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

export const updateMeSchema = userSchema.pick({
  fullName: true,
  phoneNumber: true,
  gender: true
})

export const changePasswordSchema = userSchema
  .pick({
    password: true,
    confirmPassword: true
  })
  .extend({
    oldPassword: z.string().min(1, 'Mật khẩu cũ là bắt buộc.')
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Nhập lại mật khẩu không chính xác.',
    path: ['confirmPassword']
  })

export type LoginSchema = z.infer<typeof loginSchema>
export type CreateUserSchema = z.infer<typeof createUserSchema>
export type UpdateMeSchema = z.infer<typeof updateMeSchema>
export type RegisterSchema = z.infer<typeof registerSchema>
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
