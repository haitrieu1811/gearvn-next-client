import http from '@/lib/http'
import {
  CreateProductReqBody,
  CreateProductResponse,
  GetProductResponse,
  GetProductsReqQuery,
  GetProductsResponse
} from '@/types/products.types'
import { OnlyMessageResponse } from '@/types/utils.types'

const productsApis = {
  createProduct(body: CreateProductReqBody) {
    return http.post<CreateProductResponse>('/v1/products', body)
  },

  updateProduct({ body, productId }: { body: CreateProductReqBody; productId: string }) {
    return http.put<CreateProductResponse>(`/v1/products/${productId}`, body)
  },

  deleteProduct(productId: string) {
    return http.delete<OnlyMessageResponse>(`/v1/products/${productId}`)
  },

  getProducts(params?: GetProductsReqQuery) {
    return http.get<GetProductsResponse>('/v1/products', { params })
  },

  getAllProducts(params?: GetProductsReqQuery) {
    return http.get<GetProductsResponse>('/v1/products/all', { params })
  },

  getProductForRead(productId: string) {
    return http.get<GetProductResponse>(`/v1/products/${productId}/for-read`)
  },

  getProductForUpdate(productId: string) {
    return http.get<GetProductResponse>(`/v1/products/${productId}/for-update`)
  }
} as const

export default productsApis
