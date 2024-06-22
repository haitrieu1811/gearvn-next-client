import { OrderStatus, PaymentMethod } from '@/constants/enum'

export type OriginalOrder = {
  _id?: string
  userId: string
  cartItems: string[]
  totalItems: number
  totalAmount: number
  totalAmountReduced: number
  fullName: string
  phoneNumber: string
  provinceId: string
  districtId: string
  wardId: string
  streetId: string
  detailAddress: string
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: string
  updatedAt: string
}
