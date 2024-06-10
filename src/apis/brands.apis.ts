import http from '@/lib/http'
import {
  CreateBrandReqBody,
  CreateBrandResponse,
  GetBrandResponse,
  GetBrandsResponse,
  UpdateBrandReqBody,
  UpdateBrandResponse
} from '@/types/brands.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const brandsApis = {
  getAllBrands(params?: PaginationReqQuery) {
    return http.get<GetBrandsResponse>('/v1/brands/all', { params })
  },

  createBrand(body: CreateBrandReqBody) {
    return http.post<CreateBrandResponse>('/v1/brands', body)
  },

  updateBrand({ body, brandId }: { body: UpdateBrandReqBody; brandId: string }) {
    return http.patch<UpdateBrandResponse>(`/v1/brands/${brandId}`, body)
  },

  deleteBrand(brandId: string) {
    return http.delete<OnlyMessageResponse>(`/v1/brands/${brandId}`)
  },

  getBrandById(brandId: string) {
    return http.get<GetBrandResponse>(`/v1/brands/${brandId}`)
  }
} as const

export default brandsApis
