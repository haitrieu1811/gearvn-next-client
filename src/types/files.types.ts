import { SuccessResponse } from '@/types/utils.types'

export type ImageItem = {
  _id: string
  name: string
  url: string
}

export type UploadImageResponse = SuccessResponse<{
  images: ImageItem[]
}>
