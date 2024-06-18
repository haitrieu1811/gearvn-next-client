'use client'

import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

import usersApis from '@/apis/users.apis'
import { Button } from '@/components/ui/button'
import PATH from '@/constants/path'
import { AppContext } from '@/providers/app.provider'

export default function VerifyEmail() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verifyEmailToken = searchParams.get('token')

  const { setLoggedUser } = React.useContext(AppContext)

  const verifyEmailMutation = useMutation({
    mutationKey: ['verifyEmail'],
    mutationFn: usersApis.verifyEmail,
    onSuccess: (data) => {
      toast.success(data.data.message)
      setLoggedUser(data.data.data.user)
      router.push(PATH.HOME)
    }
  })

  const handleVerifyEmail = () => {
    if (!verifyEmailToken) return
    verifyEmailMutation.mutate(verifyEmailToken)
  }

  return (
    <div className='max-w-6xl mx-auto flex justify-center py-10'>
      <Button disabled={verifyEmailMutation.isPending} onClick={handleVerifyEmail}>
        {verifyEmailMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
        Xác thực ngay
      </Button>
    </div>
  )
}
