import { ProductApprovalStatus, ProductStatus } from '@/constants/enum'
import { Pagination, SuccessResponse } from '@/types/utils.types'

type SpecificationItem = {
  _id: string
  key: string
  value: string
  createdAt: string
  updatedAt: string
}

export type OriginalProduct = {
  _id: string
  userId: string
  productCategoryId: string
  brandId: string
  name: string
  originalPrice: number
  priceAfterDiscount: number
  shortDescription: string
  description: string
  photos: string[]
  thumbnail: string
  orderNumber: number
  specifications: SpecificationItem[]
  status: number
  approvalStatus: number
  createdAt: string
  updatedAt: string
}

export type ProductItem = {
  _id: string
  name: string
  thumbnail: {
    _id: string
    url: string
  }
  originalPrice: number
  priceAfterDiscount: number
  status: ProductStatus
  approvalStatus: ProductApprovalStatus
  orderNumber: number
  specifications: SpecificationItem[]
  photos: {
    _id: string
    url: string
  }[]
  author: {
    _id: string
    email: string
    fullName: string
    avatar: string
    createdAt: string
    updatedAt: string
  }
  category: {
    _id: string
    thumbnail: string
    name: string
    createdAt: string
    updatedAt: string
  }
  brand: {
    _id: string
    thumbnail: string
    name: string
    createdAt: string
    updatedAt: string
  }
  shortDescription: string
  description: string
  createdAt: string
  updatedAt: string
}

export type CreateProductReqBody = {
  productCategoryId: string
  brandId: string
  name: string
  originalPrice: number
  priceAfterDiscount?: number
  shortDescription?: string
  description?: string
  photos: string[]
  thumbnail: string
  orderNumber?: number
  specifications?: {
    key: string
    value: string
  }[]
  status?: ProductStatus
}

export type GetProductsReqQuery = {
  categoryId?: string
  brandId?: string
  name?: string
  lowestPrice?: string
  highestPrice?: string
}

export type CreateProductResponse = SuccessResponse<{
  product: OriginalProduct
}>

export type GetProductsResponse = SuccessResponse<{
  products: ProductItem[]
  pagination: Pagination
}>

export type GetProductResponse = SuccessResponse<{
  product: ProductItem
}>
