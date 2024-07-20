'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import InputPassword from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { handleErrorsFromServer } from '@/lib/utils'
import { ChangePasswordSchema, changePasswordSchema } from '@/rules/users.rules'

export default function AccountPassword() {
  const form = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      oldPassword: '',
      password: '',
      confirmPassword: ''
    }
  })

  const changePasswordMutation = useMutation({
    mutationKey: ['changePassword'],
    mutationFn: usersApis.changePassword,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
    },
    onError: (errors) => {
      handleErrorsFromServer({ errors, form })
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    changePasswordMutation.mutate(data)
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl'>Đổi mật khẩu</CardTitle>
        <CardDescription>Để bảo mật tài khoản, vui lòng không chia sẻ mật khẩu cho người khác</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-6 pl-[100px] pr-[200px]' onSubmit={handleSubmit}>
            {/* OLD PASSWORD */}
            <div className='flex items-center space-x-5 '>
              <div className='text-sm text-right w-[100px]'>Mật khẩu cũ</div>
              <div className='flex-1'>
                <FormField
                  control={form.control}
                  name='oldPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputPassword {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* NEW PASSWORD */}
            <div className='flex items-center space-x-5 '>
              <div className='text-sm text-right w-[100px]'>Mật khẩu mới</div>
              <div className='flex-1'>
                <FormField
                  control={form.control}
                  name='password'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputPassword {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* CONFIRM NEW PASSWORD */}
            <div className='flex items-center space-x-5 '>
              <div className='text-sm text-right w-[100px]'>Nhập lại khẩu mới</div>
              <div className='flex-1'>
                <FormField
                  control={form.control}
                  name='confirmPassword'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <InputPassword {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* SUBMIT */}
            <div className='flex justify-end'>
              <Button
                disabled={changePasswordMutation.isPending}
                className='bg-main hover:bg-main-foreground uppercase'
              >
                {changePasswordMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Đổi mật khẩu
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
