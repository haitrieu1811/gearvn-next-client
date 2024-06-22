import http from '@/lib/http'
import {
  CreateReviewReqBody,
  CreateReviewResponse,
  GetReviewResponse,
  GetReviewsResponse,
  ReplyReviewReqBody,
  UpdateReviewReqBody
} from '@/types/reviews.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const reviewsApis = {
  createReview({ productId, body }: { productId: string; body: CreateReviewReqBody }) {
    return http.post<CreateReviewResponse>(`/v1/reviews/product/${productId}`, body)
  },

  updateReview({ reviewId, body }: { reviewId: string; body: UpdateReviewReqBody }) {
    return http.patch<CreateReviewResponse>(`/v1/reviews/${reviewId}`, body)
  },

  deleteReview(reviewId: string) {
    return http.delete<OnlyMessageResponse>(`/v1/reviews/${reviewId}`)
  },

  replyReview({ reviewId, body }: { reviewId: string; body: ReplyReviewReqBody }) {
    return http.post<CreateReviewResponse>(`/v1/reviews/${reviewId}/reply`, body)
  },

  getReviewsByProductId({ productId, params }: { productId: string; params?: PaginationReqQuery }) {
    return http.get<GetReviewsResponse>(`/v1/reviews/product/${productId}`, { params })
  },

  getReviewById(reviewId: string) {
    return http.get<GetReviewResponse>(`/v1/reviews/${reviewId}`)
  },

  getAllReviews(params?: PaginationReqQuery) {
    return http.get<GetReviewsResponse>('/v1/reviews/all', { params })
  },

  getRepliesOfReview({ reviewId, params }: { reviewId: string; params?: PaginationReqQuery }) {
    return http.get<GetReviewsResponse>(`/v1/reviews/${reviewId}/replies`, { params })
  }
} as const

export default reviewsApis
