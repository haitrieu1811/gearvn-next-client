import http from '@/lib/http'
import {
  CreateAddressReqBody,
  CreateAddressResponse,
  GetAddressResponse,
  GetAddressesResponse,
  GetAllProvincesResponse,
  GetDistrictsResponse,
  GetWardsResponse
} from '@/types/addresses.types'
import { OnlyMessageResponse, PaginationReqQuery } from '@/types/utils.types'

const addressesApis = {
  getAllProvinces() {
    return http.get<GetAllProvincesResponse>('/v1/addresses/provinces')
  },

  getDistricts(provinceId: string) {
    return http.get<GetDistrictsResponse>(`/v1/addresses/provinces/${provinceId}/districts`)
  },

  getWards({ provinceId, districtId }: { provinceId: string; districtId: string }) {
    return http.get<GetWardsResponse>(`/v1/addresses/provinces/${provinceId}/districts/${districtId}/wards`)
  },

  createAddress(body: CreateAddressReqBody) {
    return http.post<CreateAddressResponse>('/v1/addresses', body)
  },

  updateAddress({ body, addressId }: { body: CreateAddressReqBody; addressId: string }) {
    return http.put<CreateAddressResponse>(`/v1/addresses/${addressId}`, body)
  },

  setDefaultAddress(addressId: string) {
    return http.post<OnlyMessageResponse>(`/v1/addresses/${addressId}/set-default`)
  },

  getMyAddresses(params?: PaginationReqQuery) {
    return http.get<GetAddressesResponse>('/v1/addresses/me', { params })
  },

  getAddress(addressId: string) {
    return http.get<GetAddressResponse>(`/v1/addresses/${addressId}`)
  },

  deleteAddress(addressId: string) {
    return http.delete<OnlyMessageResponse>(`/v1/addresses/${addressId}`)
  }
} as const

export default addressesApis
