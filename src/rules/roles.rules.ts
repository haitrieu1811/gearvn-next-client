import z from 'zod'

import { RoleField, RoleType } from '@/constants/enum'

export const rolesSchema = z.object({
  name: z.string().min(1, 'Tên vai trò là bắt buộc.'),
  description: z.string().optional(),
  type: z.enum(
    [RoleType.Create.toString(), RoleType.Read.toString(), RoleType.Update.toString(), RoleType.Delete.toString()],
    {
      message: 'Loại vai trò không hợp lệ.'
    }
  ),
  field: z.enum([RoleField.Order.toString(), RoleField.Post.toString(), RoleField.Product.toString()], {
    message: 'Lĩnh vực vai trò không hợp lệ.'
  })
})

export const createRoleSchema = rolesSchema.pick({
  name: true,
  description: true,
  type: true,
  field: true
})

export type CreateRoleSchema = z.infer<typeof createRoleSchema>
