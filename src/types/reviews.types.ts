import { Pagination, SuccessResponse } from '@/types/utils.types'

export type StarPointType = 1 | 2 | 3 | 4 | 5

export type OriginalReview = {
  _id: string
  productId: string
  userId: string
  parentId: null
  starPoint: StarPointType
  content: string
  photos: string[]
  createdAt: string
  updatedAt: string
}

export type ReviewItem = {
  _id: string
  starPoint: StarPointType | null
  content: string
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
  product: {
    _id: string
    name: string
    originalPrice: number
    priceAfterDiscount: number
    thumbnail: string
    createdAt: string
    updatedAt: string
  }
  createdAt: string
  updatedAt: string
}

export type CreateReviewReqBody = {
  starPoint: StarPointType
  content?: string
  photos?: string[]
}

export type UpdateReviewReqBody = Partial<CreateReviewReqBody>

export type ReplyReviewReqBody = {
  content: string
}

export type CreateReviewResponse = SuccessResponse<{
  review: OriginalReview
}>

export type GetReviewsResponse = SuccessResponse<{
  reviews: ReviewItem[]
  pagination: Pagination
}>

export type GetReviewResponse = SuccessResponse<{
  review: ReviewItem
}>
