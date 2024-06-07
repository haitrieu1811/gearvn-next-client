import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import permissionsApis from '@/apis/permissions.apis'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { UserType } from '@/constants/enum'
import useAllRoles from '@/hooks/useAllRoles'
import useAllUsers from '@/hooks/useAllUsers'
import { CreatePermissionSchema, createPermissionSchema } from '@/rules/permissions.rules'
import { OnlyMessageResponse } from '@/types/utils.types'

type CreatePermissionFormProps = {
  onSuccess?: (data: AxiosResponse<OnlyMessageResponse, any>) => void
}

export default function CreatePermissionForm({ onSuccess }: CreatePermissionFormProps) {
  const { allUsers: allStaffs } = useAllUsers({ type: UserType.Staff })
  const { allRoles } = useAllRoles()

  const form = useForm<CreatePermissionSchema>({
    resolver: zodResolver(createPermissionSchema),
    defaultValues: {
      userId: '',
      roleId: ''
    }
  })

  const assignRoleForUserMutation = useMutation({
    mutationKey: ['assignRoleForUser'],
    mutationFn: permissionsApis.assignRoleForUser,
    onSuccess: (data) => {
      toast.success(data.data.message)
      onSuccess && onSuccess(data)
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    const { userId, roleId } = data
    assignRoleForUserMutation.mutate({ userId, roleId })
  })

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={handleSubmit}>
        <FormField
          control={form.control}
          name='userId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nhân viên</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn một nhân viên' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allStaffs.map((staff) => (
                    <SelectItem key={staff._id} value={staff._id}>
                      {staff.email}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Nhân viên mà bạn muốn phân quyền.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='roleId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vai trò</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder='Chọn một vai trò' />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {allRoles.map((role) => (
                    <SelectItem key={role._id} value={role._id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>Vai trò này sẽ được phân cho nhân viên đã chọn ở trên.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit' disabled={assignRoleForUserMutation.isPending} className='uppercase w-full'>
          {assignRoleForUserMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          Phân quyền
        </Button>
      </form>
    </Form>
  )
}
