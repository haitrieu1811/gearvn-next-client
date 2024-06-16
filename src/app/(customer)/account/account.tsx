'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Gender } from '@/constants/enum'
import isAuth from '@/hocs/isAuth'
import useIsClient from '@/hooks/useIsClient'
import useUploadImage from '@/hooks/useUploadImage'
import { handleErrorsFromServer } from '@/lib/utils'
import { AccountContext } from '@/providers/account.provider'
import { AppContext } from '@/providers/app.provider'
import { UpdateMeSchema, updateMeSchema } from '@/rules/users.rules'

export default isAuth(function Account() {
  const { isAuthenticated, setLoggedUser } = React.useContext(AppContext)
  const { avatarFile, setAvatarFile } = React.useContext(AccountContext)

  const isClient = useIsClient()
  const { uploadImageMutation } = useUploadImage()

  const form = useForm<UpdateMeSchema>({
    resolver: zodResolver(updateMeSchema),
    defaultValues: {
      fullName: '',
      gender: '',
      phoneNumber: ''
    }
  })

  const getMeQuery = useQuery({
    queryKey: ['getMe', isAuthenticated],
    queryFn: () => usersApis.getMe(),
    enabled: isAuthenticated
  })

  const me = React.useMemo(() => getMeQuery.data?.data.data.me, [getMeQuery.data?.data.data.me])

  // UPDATE DATA INTO THE FORM
  React.useEffect(() => {
    if (!me) return
    const { setValue } = form
    const { fullName, phoneNumber, gender } = me
    setValue('fullName', fullName)
    setValue('phoneNumber', phoneNumber)
    setValue('gender', gender.toString())
  }, [form, me])

  const updateMeMutation = useMutation({
    mutationKey: ['updateMe'],
    mutationFn: usersApis.updateMe,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getMeQuery.refetch()
      setLoggedUser(data.data.data.user)
      setAvatarFile(null)
    },
    onError: (errors) => {
      handleErrorsFromServer({ errors, form })
    }
  })

  const isFormPending = uploadImageMutation.isPending || updateMeMutation.isPending

  const handleSubmit = form.handleSubmit(async (data) => {
    let avatarId = !!me?.avatar ? me.avatar._id : undefined
    if (avatarFile) {
      const form = new FormData()
      form.append('image', avatarFile)
      const res = await uploadImageMutation.mutateAsync(form)
      avatarId = res.data.data.images[0]._id
    }
    const { fullName, phoneNumber, gender } = data
    const body = omitBy(
      {
        fullName: fullName !== me?.fullName ? fullName : undefined,
        phoneNumber: phoneNumber !== me?.phoneNumber ? phoneNumber : undefined,
        gender: Number(gender) !== me?.gender ? Number(gender) : undefined,
        avatar: avatarId
      },
      isUndefined
    )
    updateMeMutation.mutate(body)
  })

  return (
    <Card className='rounded-md shadow-none border-0'>
      <CardHeader>
        <CardTitle className='text-xl'>Thông tin tài khoản</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className='space-y-8 pl-[100px] pr-[200px]' onSubmit={handleSubmit}>
            {/* EMAIL */}
            <div className='flex items-center space-x-5 '>
              <div className='text-sm text-right w-[100px]'>Email</div>
              <div className='flex-1'>{me && isClient && <Input type='text' value={me.email} disabled />}</div>
            </div>
            {/* FULLNAME */}
            <div className='flex items-center space-x-5'>
              <div className='text-sm text-right w-[100px]'>Họ và tên</div>
              <div className='flex-1'>
                <FormField
                  control={form.control}
                  name='fullName'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type='text' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* PHONE NUMBER */}
            <div className='flex items-center space-x-5'>
              <div className='text-sm text-right w-[100px]'>Số điện thoại</div>
              <div className='flex-1'>
                <FormField
                  control={form.control}
                  name='phoneNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input type='text' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* GENDER */}
            <div className='flex items-center space-x-5'>
              <div className='text-sm text-right w-[100px]'>Giới tính</div>
              <div className='flex-1'>
                <FormField
                  control={form.control}
                  name='gender'
                  render={({ field }) => (
                    <FormItem className='space-y-3'>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          className='flex space-x-2'
                        >
                          {[
                            {
                              value: Gender.Male.toString(),
                              label: 'Nam'
                            },
                            {
                              value: Gender.Female.toString(),
                              label: 'Nữ'
                            },
                            {
                              value: Gender.Other.toString(),
                              label: 'Khác'
                            }
                          ].map(({ value, label }, index) => (
                            <FormItem key={index} className='flex items-center space-x-3 space-y-0'>
                              <FormControl>
                                <RadioGroupItem value={value} />
                              </FormControl>
                              <FormLabel className='font-normal'>{label}</FormLabel>
                            </FormItem>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            {/* SUBMIT */}
            <div className='flex justify-end'>
              <Button type='submit' disabled={isFormPending} className='bg-main hover:bg-main-foreground uppercase'>
                {isFormPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                Lưu thay đổi
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
})
