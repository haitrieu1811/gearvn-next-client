import { OrderStatus, PaymentMethod } from '@/constants/enum'
import { OriginalOrder } from '@/types/orders.types'
import { Pagination, SuccessResponse } from '@/types/utils.types'

export type OriginalCartItem = {
  _id?: string
  userId: string
  productId: string
  unitPrice: number
  quantity: number
  status: OrderStatus
  createdAt: Date
  updatedAt: Date
}

export type CartItem = {
  _id: string
  product: {
    _id: string
    name: string
    originalPrice: number
    priceAfterDiscount: number
    thumbnail: string
    createdAt: string
    updatedAt: string
  }
  unitPrice: number
  quantity: OrderStatus
  createdAt: string
  updatedAt: string
}

export type CheckoutReqBody = {
  fullName: string
  phoneNumber: string
  provinceId: string
  districtId: string
  wardId: string
  streetId: string
  detailAddress: string
  paymentMethod: PaymentMethod
}

export type AddProductToCartResponse = SuccessResponse<{
  cartItem: OriginalCartItem
}>

export type UpdateCartItemResponse = SuccessResponse<{
  cartItem: OriginalCartItem
}>

export type GetMyCartResponse = SuccessResponse<{
  totalItems: number
  totalAmount: number
  cartItems: CartItem[]
  pagination: Pagination
}>

export type CheckoutResponse = SuccessResponse<{
  order: OriginalOrder
}>
