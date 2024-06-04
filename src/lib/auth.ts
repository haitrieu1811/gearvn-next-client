'use client'

import { LoggedUser } from '@/types/users.types'

export const setAccessTokenToLS = (accessToken: string) => {
  if (typeof window === 'undefined') return
  return localStorage.setItem('accessToken', accessToken)
}

export const getAccessTokenFromLS = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

export const removeAccessTokenFromLS = () => {
  if (typeof window === 'undefined') return
  return localStorage.removeItem('accessToken')
}

export const setRefreshTokenToLS = (refreshToken: string) => {
  if (typeof window === 'undefined') return
  return localStorage.setItem('refreshToken', refreshToken)
}

export const getRefreshTokenFromLS = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('refreshToken')
}

export const removeRefreshTokenFromLS = () => {
  if (typeof window === 'undefined') return
  return localStorage.removeItem('refreshToken')
}

export const setLoggedUserToLS = (loggedUser: LoggedUser) => {
  if (typeof window === 'undefined') return
  return localStorage.setItem('loggedUser', JSON.stringify(loggedUser))
}

export const getLoggedUserFromLS = (): LoggedUser | null => {
  if (typeof window === 'undefined') return null
  const loggedUser = localStorage.getItem('loggedUser')
  if (loggedUser) return JSON.parse(loggedUser)
  return null
}

export const removeLoggedUserFromLS = () => {
  if (typeof window === 'undefined') return
  return localStorage.removeItem('loggedUser')
}

export const resetAuthLS = () => {
  removeAccessTokenFromLS()
  removeRefreshTokenFromLS()
  removeLoggedUserFromLS()
}
