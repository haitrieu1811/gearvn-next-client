'use client'

import { redirect } from 'next/navigation'
import React from 'react'

import { UserType } from '@/constants/enum'
import PATH from '@/constants/path'
import useIsClient from '@/hooks/useIsClient'
import { AppContext } from '@/providers/app.provider'

export default function isAuthWithAdmin(Component: any) {
  return function IsAuthWithAdmin(props: any) {
    const { isAuthenticated, loggedUser } = React.useContext(AppContext)

    const isClient = useIsClient()

    React.useEffect(() => {
      if (!isAuthenticated && isClient) {
        redirect(PATH.HOME)
      } else {
        if (loggedUser?.type !== UserType.Admin) {
          redirect(PATH.HOME)
        }
      }
    }, [isAuthenticated, isClient, loggedUser])

    if (!isAuthenticated && isClient) {
      return null
    } else if (isAuthenticated && isClient) {
      if (loggedUser?.type === UserType.Admin) {
        return <Component {...props} />
      } else {
        return null
      }
    } else {
      return null
    }
  }
}
