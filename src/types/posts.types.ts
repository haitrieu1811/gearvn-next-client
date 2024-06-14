import { PostApprovalStatus, PostStatus } from '@/constants/enum'
import { Pagination, SuccessResponse } from '@/types/utils.types'

export type OriginalPost = {
  _id: string
  userId: string
  title: string
  content: string
  description: string
  thumbnail: string
  orderNumber: number
  status: PostStatus
  approvalStatus: PostApprovalStatus
  createdAt: string
  updatedAt: string
}

export type PostItem = {
  _id: string
  thumbnail: {
    _id: string
    url: string
  }
  title: string
  description: string
  content: string
  author: {
    _id: string
    email: string
    fullName: string
    avatar: string
    createdAt: string
    updatedAt: string
  }
  orderNumber: number
  status: PostStatus
  approvalStatus: PostApprovalStatus
  createdAt: string
  updatedAt: string
}

export type CreatePostReqBody = {
  title: string
  content: string
  description: string
  thumbnail: string
  orderNumber?: number
  status?: PostStatus
  approvalStatus?: PostApprovalStatus
}

export type UpdatePostReqBody = Partial<CreatePostReqBody>

export type CreatePostResponse = SuccessResponse<{
  post: OriginalPost
}>

export type UpdatePostResponse = SuccessResponse<{
  post: OriginalPost
}>

export type GetPostsResponse = SuccessResponse<{
  posts: PostItem[]
  pagination: Pagination
}>

export type GetPostResponse = SuccessResponse<{
  post: PostItem
}>
