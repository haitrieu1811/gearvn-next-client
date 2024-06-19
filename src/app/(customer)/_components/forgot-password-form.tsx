'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { handleErrorsFromServer } from '@/lib/utils'
import { ForgotPasswordSchema, forgotPasswordSchema } from '@/rules/users.rules'
import { OnlyMessageResponse } from '@/types/utils.types'

type ForgotPasswordFormProps = {
  onSuccess?: (data: AxiosResponse<OnlyMessageResponse, any>) => void
}

export default function ForgotPasswordForm({ onSuccess }: ForgotPasswordFormProps) {
  const form = useForm<ForgotPasswordSchema>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const forgotPasswordMutation = useMutation({
    mutationKey: ['forgotPassword'],
    mutationFn: usersApis.forgotPassword,
    onSuccess: (data) => {
      toast.success(data.data.message)
      onSuccess && onSuccess(data)
    },
    onError: (errors) => {
      handleErrorsFromServer({ errors, form })
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    forgotPasswordMutation.mutate(data.email)
  })

  return (
    <Form {...form}>
      <form className='space-y-8' onSubmit={handleSubmit}>
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
                Nhập email bạn đã sử dụng để đăng ký tài khoản, sau đó bạn sẽ nhận được mail đặt lại mật khẩu về địa chỉ
                email vừa nhập.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={forgotPasswordMutation.isPending} className='w-full uppercase'>
          {forgotPasswordMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          Gửi yêu cầu đặt lại mật khẩu
        </Button>
      </form>
    </Form>
  )
}
