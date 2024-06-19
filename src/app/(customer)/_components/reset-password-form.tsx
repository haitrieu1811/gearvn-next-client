'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import InputPassword from '@/components/input-password'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import PATH from '@/constants/path'
import { handleErrorsFromServer } from '@/lib/utils'
import { AppContext } from '@/providers/app.provider'
import { ResetPasswordSchema, resetPasswordSchema } from '@/rules/users.rules'

export default function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const forgotPasswordToken = searchParams.get('token')

  const { setIsAuthenticated, setLoggedUser } = React.useContext(AppContext)

  const form = useForm<ResetPasswordSchema>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: ''
    }
  })

  const resetPasswordMutation = useMutation({
    mutationKey: ['resetPassword'],
    mutationFn: usersApis.resetPassword,
    onSuccess: (data) => {
      form.reset()
      toast.success(data.data.message)
      setLoggedUser(data.data.data.user)
      setIsAuthenticated(true)
      router.push(PATH.HOME)
    },
    onError: (errors) => {
      handleErrorsFromServer({ errors, form })
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    if (!forgotPasswordToken) return
    resetPasswordMutation.mutate({
      ...data,
      forgotPasswordToken
    })
  })

  return (
    <Form {...form}>
      <div className='max-w-xl mx-auto py-5'>
        <Card className='shadow-none border-none rounded-md'>
          <CardHeader>
            <CardTitle className='text-2xl'>Đặt lại mật khẩu</CardTitle>
          </CardHeader>
          <CardContent>
            <form className='space-y-8' onSubmit={handleSubmit}>
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
              <Button disabled={resetPasswordMutation.isPending} className='w-full uppercase'>
                {resetPasswordMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Đặt lại mật khẩu
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Form>
  )
}
