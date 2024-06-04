'use client'

import React from 'react'

import { getAccessTokenFromLS, getLoggedUserFromLS } from '@/lib/auth'
import { LoggedUser } from '@/types/users.types'

type AppContext = {
  isAuthenticated: boolean
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>
  loggedUser: LoggedUser | null
  setLoggedUser: React.Dispatch<React.SetStateAction<LoggedUser | null>>
}

const initialAppContext: AppContext = {
  isAuthenticated: !!getAccessTokenFromLS(),
  setIsAuthenticated: () => null,
  loggedUser: getLoggedUserFromLS(),
  setLoggedUser: () => null
}

export const AppContext = React.createContext<AppContext>(initialAppContext)

export default function AppProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [isAuthenticated, setIsAuthenticated] = React.useState<boolean>(initialAppContext.isAuthenticated)
  const [loggedUser, setLoggedUser] = React.useState<LoggedUser | null>(initialAppContext.loggedUser)

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        setIsAuthenticated,
        loggedUser,
        setLoggedUser
      }}
    >
      {children}
    </AppContext.Provider>
  )
}
