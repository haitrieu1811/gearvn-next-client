'use client'

import React from 'react'

type AccountContext = {
  avatarFile: File | null
  setAvatarFile: React.Dispatch<React.SetStateAction<File | null>>
}

const initialAccountContext: AccountContext = {
  avatarFile: null,
  setAvatarFile: () => null
}

export const AccountContext = React.createContext<AccountContext>(initialAccountContext)

export default function AccountProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const [avatarFile, setAvatarFile] = React.useState<File | null>(initialAccountContext.avatarFile)

  return (
    <AccountContext.Provider
      value={{
        avatarFile,
        setAvatarFile
      }}
    >
      {children}
    </AccountContext.Provider>
  )
}
