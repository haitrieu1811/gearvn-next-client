'use client'

import { redirect } from 'next/navigation'
import React from 'react'

import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app.provider'

export default function isNotAuth(Component: any) {
  return function IsNotAuth(props: any) {
    const { isAuthenticated } = React.useContext(AppContext)
    const isClient = useIsClient()

    React.useEffect(() => {
      if (isAuthenticated && isClient) {
        return redirect(PATH.HOME)
      }
    }, [isAuthenticated, isClient])

    if (isAuthenticated && isClient) {
      return null
    }

    return <Component {...props} />
  }
}
