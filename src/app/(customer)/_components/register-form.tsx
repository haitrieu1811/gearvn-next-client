'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import InputPassword from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { handleErrorsFromServer } from '@/lib/utils'
import { AppContext } from '@/providers/app.provider'
import { RegisterSchema, registerSchema } from '@/rules/users.rules'
import { AuthResponse } from '@/types/utils.types'

type RegisterFormProps = {
  onSuccess?: (data: AxiosResponse<AuthResponse, any>) => void
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const { setIsAuthenticated, setLoggedUser } = React.useContext(AppContext)

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
      confirmPassword: ''
    }
  })

  const registerMutation = useMutation({
    mutationKey: ['register'],
    mutationFn: usersApis.register,
    onSuccess: (data) => {
      toast.success(data.data.message)
      setIsAuthenticated(true)
      setLoggedUser(data.data.data.user)
      onSuccess && onSuccess(data)
    },
    onError: (errors) => {
      handleErrorsFromServer({ errors, form })
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    registerMutation.mutate(data)
  })

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={handleSubmit}>
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
                Sau khi tạo tài khoản thành công bạn sẽ nhận một email xác minh đến địa chỉ email này, hãy kiểm tra và
                xác minh email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
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
              <FormMessage />
            </FormItem>
          )}
        />
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
        {/* SUBMIT */}
        <Button type='submit' disabled={registerMutation.isPending} className='w-full uppercase'>
          {registerMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          Đăng ký
        </Button>
      </form>
    </Form>
  )
}
