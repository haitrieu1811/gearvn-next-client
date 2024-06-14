import http from '@/lib/http'
import {
  CreatePostReqBody,
  CreatePostResponse,
  GetPostResponse,
  GetPostsResponse,
  UpdatePostReqBody,
  UpdatePostResponse
} from '@/types/posts.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const postsApis = {
  createPost(body: CreatePostReqBody) {
    return http.post<CreatePostResponse>('/v1/posts', body)
  },

  updatePost({ body, postId }: { body: UpdatePostReqBody; postId: string }) {
    return http.patch<UpdatePostResponse>(`/v1/posts/${postId}`, body)
  },

  deletePost(postId: string) {
    return http.delete<OnlyMessageResponse>(`/v1/posts/${postId}`)
  },

  getPublicPosts(params?: PaginationReqQuery) {
    return http.get<GetPostsResponse>('/v1/posts', { params })
  },

  getAllPosts(params?: PaginationReqQuery) {
    return http.get<GetPostsResponse>('/v1/posts/all', { params })
  },

  getPostForRead(postId: string) {
    return http.get<GetPostResponse>(`/v1/posts/${postId}/for-read`)
  },

  getPostForUpdate(postId: string) {
    return http.get<GetPostResponse>(`/v1/posts/${postId}/for-update`)
  }
} as const

export default postsApis
