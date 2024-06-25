import { OrderStatus, PaymentMethod } from '@/constants/enum'
import { Pagination, PaginationReqQuery, SuccessResponse } from '@/types/utils.types'

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
  detailAddress: string
  paymentMethod: PaymentMethod
  status: OrderStatus
  createdAt: string
  updatedAt: string
}

export type OrderItem = {
  _id: string
  fullName: string
  phoneNumber: string
  totalItems: number
  totalAmount: number
  totalAmountReduced: number
  paymentMethod: PaymentMethod
  status: OrderStatus
  cartItems: {
    _id: string
    unitPrice: number
    quantity: number
    status: OrderStatus
    product: {
      _id: string
      name: string
      originalPrice: number
      priceAfterDiscount: number
      thumbnail: string
    }
  }[]
  province: {
    _id: string
    code: string
    name: string
  }
  district: {
    id: string
    name: string
  }
  ward: {
    id: string
    name: string
    prefix: string
  }
  detailAddress: string
  note: string
  createdAt: string
  updatedAt: string
}

export type GetOrdersReqQuery = PaginationReqQuery & {
  status?: OrderStatus
}

export type GetOrdersResponse = SuccessResponse<{
  orders: OrderItem[]
  pagination: Pagination
}>

export type UpdateOrderResponse = SuccessResponse<{
  order: OriginalOrder
}>

export type GetOrderResponse = SuccessResponse<{
  order: OrderItem
}>
