import { ProductCategoryStatus } from '@/constants/enum'
import { Pagination, SuccessResponse } from '@/types/utils.types'

export type ProductCategoryItem = {
  _id: string
  thumbnail: string
  name: string
  description: string
  status: ProductCategoryStatus
  orderNumber: number
  createdAt: string
  updatedAt: string
}

export type OriginalProductCategory = {
  _id: string
  userId: string
  thumbnail: string
  name: string
  description: string
  status: ProductCategoryStatus
  orderNumber: number
  createdAt: string
  updatedAt: string
}

export type CreateProductCategoryReqBody = {
  thumbnail: string
  name: string
  description?: string
  status?: ProductCategoryStatus
  orderNumber?: number
}

export type UpdateProductCategoryReqBody = Partial<CreateProductCategoryReqBody>

export type GetProductCategoriesResponse = SuccessResponse<{
  productCategories: ProductCategoryItem[]
  pagination: Pagination
}>

export type CreateProductCategoryResponse = SuccessResponse<{
  productCategory: OriginalProductCategory
}>

export type GetProductCategoryResponse = SuccessResponse<{
  productCategory: ProductCategoryItem
}>

export type UpdateProductCategoryResponse = SuccessResponse<{
  productCategory: OriginalProductCategory
}>
