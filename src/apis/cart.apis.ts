import http from '@/lib/http'
import {
  AddProductToCartResponse,
  CheckoutReqBody,
  CheckoutResponse,
  GetMyCartResponse,
  UpdateCartItemResponse
} from '@/types/cart.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const cartApis = {
  addProductToCart({ productId, quantity }: { productId: string; quantity: number }) {
    return http.post<AddProductToCartResponse>(`/v1/cart-items/add-to-cart/product/${productId}`, { quantity })
  },

  updateCartItem({ cartItemId, quantity }: { cartItemId: string; quantity: number }) {
    return http.patch<UpdateCartItemResponse>(`/v1/cart-items/${cartItemId}`, { quantity })
  },

  deleteCartItem(cartItemId: string) {
    return http.delete<OnlyMessageResponse>(`/v1/cart-items/${cartItemId}`)
  },

  getMyCart(params?: PaginationReqQuery) {
    return http.get<GetMyCartResponse>('/v1/cart-items/me', { params })
  },

  checkout(body: CheckoutReqBody) {
    return http.post<CheckoutResponse>('/v1/cart-items/checkout', body)
  }
} as const

export default cartApis
