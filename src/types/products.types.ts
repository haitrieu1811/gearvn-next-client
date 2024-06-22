import { ProductApprovalStatus, ProductStatus } from '@/constants/enum'
import { Pagination, PaginationReqQuery, SuccessResponse } from '@/types/utils.types'

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

const a = {
  totalReview: 1,
  averageReview: 2,
  totalOneStar: 0,
  totalTwoStar: 1,
  totalThreeStar: 0,
  totalFourStar: 0,
  totalFiveStar: 0
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
  review: {
    totalReview: number
    averageReview: number
    totalOneStar: number
    totalTwoStar: number
    totalThreeStar: number
    totalFourStar: number
    totalFiveStar: number
  }
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

export type SortByProduct = 'priceAfterDiscount' | 'name'
export type OrderByProduct = 'asc' | 'desc'

export type GetProductsReqQuery = PaginationReqQuery & {
  categoryId?: string
  brandId?: string
  name?: string
  lowestPrice?: string
  highestPrice?: string
  sortBy?: SortByProduct
  orderBy?: OrderByProduct
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
