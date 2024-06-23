'use client'

import React from 'react'

import { PaymentMethod } from '@/constants/enum'
import { AddressItem } from '@/types/addresses.types'

type CheckoutContext = {
  note: string
  paymentMethod: PaymentMethod
  currentAddress: AddressItem | undefined
  setNote: React.Dispatch<React.SetStateAction<string>>
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethod>>
  setCurrentAddress: React.Dispatch<React.SetStateAction<AddressItem | undefined>>
}

const initialContext: CheckoutContext = {
  note: '',
  paymentMethod: PaymentMethod.Cash,
  currentAddress: undefined,
  setNote: () => null,
  setPaymentMethod: () => null,
  setCurrentAddress: () => null
}

export const CheckoutContext = React.createContext<CheckoutContext>(initialContext)

export default function CheckoutProvider({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const [note, setNote] = React.useState<string>(initialContext.note)
  const [paymentMethod, setPaymentMethod] = React.useState<PaymentMethod>(initialContext.paymentMethod)
  const [currentAddress, setCurrentAddress] = React.useState<AddressItem | undefined>(undefined)

  return (
    <CheckoutContext.Provider
      value={{
        note,
        paymentMethod,
        currentAddress,
        setNote,
        setPaymentMethod,
        setCurrentAddress
      }}
    >
      {children}
    </CheckoutContext.Provider>
  )
}
