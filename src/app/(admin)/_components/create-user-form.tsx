import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import InputPassword from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Gender, UserType } from '@/constants/enum'
import { handleErrorsFromServer } from '@/lib/utils'
import { CreateUserSchema, createUserSchema } from '@/rules/users.rules'
import { GetAllUsersResponse } from '@/types/users.types'

type CreateUserFormProps = {
  onSuccess?: (data: AxiosResponse<GetAllUsersResponse, any>) => void
}

export default function CreateUserForm({ onSuccess }: CreateUserFormProps) {
  const form = useForm<CreateUserSchema>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: '',
      gender: String(Gender.Male),
      type: String(UserType.Staff)
    }
  })

  const createUserMutation = useMutation({
    mutationKey: ['createUser'],
    mutationFn: usersApis.createUser,
    onSuccess: (data) => {
      toast.success(data.data.message)
      onSuccess && onSuccess(data)
    },
    onError: (errors) => {
      handleErrorsFromServer({ form, errors })
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    createUserMutation.mutate({
      ...data,
      gender: Number(data.gender),
      type: Number(data.type)
    })
  })

  return (
    <Form {...form}>
      <form className='space-y-5' onSubmit={handleSubmit}>
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-6'>
            {/* EMAIL */}
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormDescription>
                    Lưu ý: Email nên nhập chính xác vì email là cách duy nhất để lấy lại mật khẩu khi mất.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
            {/* FULLNAME */}
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-6'>
            {/* GENDER */}
            <FormField
              control={form.control}
              name='gender'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Giới tính</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Hãy chọn một giới tính' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        {
                          value: Gender.Male.toString(),
                          name: 'Nam'
                        },
                        {
                          value: Gender.Female.toString(),
                          name: 'Nữ'
                        },
                        {
                          value: Gender.Other.toString(),
                          name: 'Khác'
                        }
                      ].map((item, index) => (
                        <SelectItem key={index} value={item.value}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
            {/* USER TYPE */}
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Loại người dùng</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Hãy chọn một loại người dùng' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {[
                        {
                          value: UserType.Staff.toString(),
                          name: 'Nhân viên'
                        },
                        {
                          value: UserType.Customer.toString(),
                          name: 'Khách hàng'
                        }
                      ].map((item, index) => (
                        <SelectItem key={index} value={item.value}>
                          {item.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-6'>
            {/* PASSWORD */}
            <FormField
              control={form.control}
              name='password'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormDescription>
                    Mật khẩu dài từ 12 đến 36 ký tự, chứa ít nhất một chữ cái viết hoa, một chữ cái viết thường, một chữ
                    số và một ký tự đặc biệt.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
            {/* CONFIRM PASSWORD */}
            <FormField
              control={form.control}
              name='confirmPassword'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nhập lại mật khẩu</FormLabel>
                  <FormControl>
                    <InputPassword {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='flex justify-end'>
          {/* SUBMIT */}
          <Button type='submit' disabled={createUserMutation.isPending} className='uppercase w-full'>
            {createUserMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            Tạo người dùng
          </Button>
        </div>
      </form>
    </Form>
  )
}
