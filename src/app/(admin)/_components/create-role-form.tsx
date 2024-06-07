import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import rolesApis from '@/apis/roles.apis'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { RoleField, RoleType } from '@/constants/enum'
import { CreateRoleSchema, createRoleSchema } from '@/rules/roles.rules'
import { CreateRoleReqBody, CreateRoleResponse, UpdateRoleResponse } from '@/types/roles.types'

type CreateRoleFormProps = {
  roleId?: string
  onCreateSuccess?: (data: AxiosResponse<CreateRoleResponse, any>) => void
  onUpdateSuccess?: (data: AxiosResponse<UpdateRoleResponse, any>) => void
}

export default function CreateRoleForm({ roleId, onCreateSuccess, onUpdateSuccess }: CreateRoleFormProps) {
  const queryClient = useQueryClient()

  const isUpdateMode = !!roleId

  const form = useForm<CreateRoleSchema>({
    resolver: zodResolver(createRoleSchema),
    defaultValues: {
      name: '',
      description: ''
    }
  })

  const getRoleQuery = useQuery({
    queryKey: ['getRole', roleId],
    queryFn: () => rolesApis.findOne(roleId as string),
    enabled: !!roleId
  })

  const role = React.useMemo(() => getRoleQuery.data?.data.data.role, [getRoleQuery.data?.data.data.role])

  React.useEffect(() => {
    if (!role) return
    const { setValue } = form
    const { name, description, type, field } = role
    setValue('name', name)
    setValue('description', description)
    setValue('type', type.toString())
    setValue('field', field.toString())
  }, [form, role])

  const createRoleMutation = useMutation({
    mutationKey: ['createRole'],
    mutationFn: rolesApis.create,
    onSuccess: (data) => {
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['getAllRoles'] })
      onCreateSuccess && onCreateSuccess(data)
    }
  })

  const updateRoleMutation = useMutation({
    mutationKey: ['updateRole'],
    mutationFn: rolesApis.update,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getRoleQuery.refetch()
      queryClient.invalidateQueries({ queryKey: ['getAllRoles'] })
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const isPending = createRoleMutation.isPending || updateRoleMutation.isPending

  const handleSubmit = form.handleSubmit((data) => {
    const body: CreateRoleReqBody = {
      ...data,
      type: Number(data.type),
      field: Number(data.field)
    }
    if (!isUpdateMode) {
      createRoleMutation.mutate(body)
      return
    }
    updateRoleMutation.mutate({ body, roleId })
  })

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên vai trò</FormLabel>
              <FormControl>
                <Input type='text' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='description'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả vai trò</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex space-x-5'>
          <FormField
            control={form.control}
            name='type'
            render={({ field }) => (
              <FormItem className='flex-auto'>
                <FormLabel>Loại vai trò</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Hãy chọn một loại vai trò' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      {
                        value: RoleType.Create.toString(),
                        text: 'Thêm'
                      },
                      {
                        value: RoleType.Read.toString(),
                        text: 'Đọc'
                      },
                      {
                        value: RoleType.Update.toString(),
                        text: 'Sửa'
                      },
                      {
                        value: RoleType.Delete.toString(),
                        text: 'Xóa'
                      }
                    ].map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='field'
            render={({ field }) => (
              <FormItem className='flex-auto'>
                <FormLabel>Lĩnh vực vai trò</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder='Hãy chọn một lĩnh vực vai trò' />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {[
                      {
                        value: RoleField.Product.toString(),
                        text: 'Sản phẩm'
                      },
                      {
                        value: RoleField.ProductCategory.toString(),
                        text: 'Danh mục sản phẩm'
                      },
                      {
                        value: RoleField.Post.toString(),
                        text: 'Bài viết'
                      },
                      {
                        value: RoleField.PostCategory.toString(),
                        text: 'Danh mục bài viết'
                      },
                      {
                        value: RoleField.Order.toString(),
                        text: 'Đơn hàng'
                      }
                    ].map((item) => (
                      <SelectItem key={item.value} value={item.value}>
                        {item.text}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type='submit' disabled={isPending} className='w-full uppercase'>
          {isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          {!isUpdateMode ? 'Tạo vai trò' : 'Cập nhật vai trò'}
        </Button>
      </form>
    </Form>
  )
}
