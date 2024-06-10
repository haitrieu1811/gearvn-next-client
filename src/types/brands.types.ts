import { BrandStatus } from '@/constants/enum'
import { Pagination, SuccessResponse } from '@/types/utils.types'

export type BrandItem = {
  _id: string
  thumbnail: string
  name: string
  description: string
  status: BrandStatus
  orderNumber: number
  createdAt: string
  updatedAt: string
}

export type OriginalBrand = {
  _id: string
  userId: string
  thumbnail: string
  name: string
  description: string
  status: BrandStatus
  orderNumber: number
  createdAt: string
  updatedAt: string
}

export type CreateBrandReqBody = {
  thumbnail: string
  name: string
  description?: string
  status?: BrandStatus
  orderNumber?: number
}

export type UpdateBrandReqBody = Partial<CreateBrandReqBody>

export type GetBrandsResponse = SuccessResponse<{
  brands: BrandItem[]
  pagination: Pagination
}>

export type CreateBrandResponse = SuccessResponse<{
  brand: OriginalBrand
}>

export type UpdateBrandResponse = SuccessResponse<{
  brand: OriginalBrand
}>

export type GetBrandResponse = SuccessResponse<{
  brand: BrandItem
}>
