import z from 'zod'

export const permissionSchema = z.object({
  userId: z.string().min(1, 'User ID là bắt buộc.'),
  roleId: z.string().min(1, 'Role ID là bắt buộc.')
})

export const createPermissionSchema = permissionSchema.pick({
  userId: true,
  roleId: true
})

export type CreatePermissionSchema = z.infer<typeof createPermissionSchema>
