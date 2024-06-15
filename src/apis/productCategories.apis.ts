import http from '@/lib/http'
import {
  CreateProductCategoryReqBody,
  CreateProductCategoryResponse,
  GetProductCategoriesResponse,
  GetProductCategoryResponse,
  UpdateProductCategoryReqBody,
  UpdateProductCategoryResponse
} from '@/types/productCategories.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const productCategoriesApis = {
  getAllProductCategories(params?: PaginationReqQuery) {
    return http.get<GetProductCategoriesResponse>('/v1/product-categories/all', { params })
  },

  createProductCategory(body: CreateProductCategoryReqBody) {
    return http.post<CreateProductCategoryResponse>('/v1/product-categories', body)
  },

  getProductCategoryById(productCategoryId: string) {
    return http.get<GetProductCategoryResponse>(`/v1/product-categories/${productCategoryId}`)
  },

  updateProductCategory({
    body,
    productCategoryId
  }: {
    body: UpdateProductCategoryReqBody
    productCategoryId: string
  }) {
    return http.patch<UpdateProductCategoryResponse>(`/v1/product-categories/${productCategoryId}`, body)
  },

  deleteProductCategory(productCategoryId: string) {
    return http.delete<OnlyMessageResponse>(`/v1/product-categories/${productCategoryId}`)
  },

  getProductCategories(params?: PaginationReqQuery) {
    return http.get<GetProductCategoriesResponse>('/v1/product-categories', { params })
  }
} as const

export default productCategoriesApis
