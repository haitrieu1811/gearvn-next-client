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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { handleErrorsFromServer } from '@/lib/utils'
import { AppContext } from '@/providers/app.provider'
import { LoginSchema, loginSchema } from '@/rules/users.rules'
import { AuthResponse } from '@/types/utils.types'

type LoginFormProps = {
  onSuccess?: (data: AxiosResponse<AuthResponse, any>) => void
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const { setIsAuthenticated, setLoggedUser } = React.useContext(AppContext)

  const form = useForm<LoginSchema>({
    defaultValues: {
      email: '',
      password: ''
    },
    resolver: zodResolver(loginSchema)
  })

  const loginMutation = useMutation({
    mutationKey: ['login'],
    mutationFn: usersApis.login,
    onSuccess: async (data) => {
      const { user } = data.data.data
      setIsAuthenticated(true)
      setLoggedUser(user)
      toast.success(data.data.message)
      onSuccess && onSuccess(data)
      await fetch('/api/auth/set-cookie', {
        method: 'POST',
        body: JSON.stringify({ accessToken: data.data.data.accessToken })
      })
    },
    onError: (errors) => {
      handleErrorsFromServer({ form, errors })
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    loginMutation.mutate(data)
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
              <FormMessage />
            </FormItem>
          )}
        />
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
        <Button type='submit' disabled={loginMutation.isPending} className='w-full uppercase'>
          {loginMutation.isPending && <Loader2 className='w-4 h-4 mr-3 animate-spin' />}
          Đăng nhập
        </Button>
      </form>
    </Form>
  )
}
