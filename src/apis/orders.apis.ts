import { OrderStatus } from '@/constants/enum'
import http from '@/lib/http'
import { GetOrderResponse, GetOrdersReqQuery, GetOrdersResponse, UpdateOrderResponse } from '@/types/orders.types'
import { OnlyMessageResponse } from '@/types/utils.types'

const ordersApis = {
  getMyOrders(params?: GetOrdersReqQuery) {
    return http.get<GetOrdersResponse>('/v1/orders/me', { params })
  },

  getAllOrders(params?: GetOrdersReqQuery) {
    return http.get<GetOrdersResponse>('/v1/orders/all', { params })
  },

  getOrderDetail(orderId: string) {
    return http.get<GetOrderResponse>(`/v1/orders/${orderId}`)
  },

  updateOrder({ status, orderId }: { status: OrderStatus; orderId: string }) {
    return http.patch<UpdateOrderResponse>(`/v1/orders/${orderId}`, { status })
  },

  deleteOrder(orderId: string) {
    return http.delete<OnlyMessageResponse>(`/v1/orders/${orderId}`)
  }
} as const

export default ordersApis
