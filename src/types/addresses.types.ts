import { AddressType } from '@/constants/enum'
import { Pagination, SuccessResponse } from '@/types/utils.types'

export type ProvinceItem = {
  _id: string
  code: string
  name: string
}

export type DistrictItem = {
  id: string
  name: string
}

export type WardItem = {
  id: string
  name: string
  prefix: string
}

export type StreetItem = {
  id: string
  name: string
  prefix: string
}

export type OriginalAddress = {
  _id: string
  userId: string
  provinceId: string
  districtId: string
  wardId: string
  streetId: string
  detailAddress: string
  type: AddressType
  fullName: string
  phoneNumber: string
  createdAt: string
  updatedAt: string
}

export type AddressItem = {
  _id: string
  fullName: string
  phoneNumber: string
  province: ProvinceItem
  district: DistrictItem
  ward: WardItem
  street: StreetItem
  detailAddress: string
  type: AddressType
  isDefaultAddress: boolean
  createdAt: string
  updatedAt: string
}

export type CreateAddressReqBody = {
  provinceId: string
  districtId: string
  wardId: string
  streetId: string
  detailAddress: string
  type: AddressType
  fullName: string
  phoneNumber: string
}

export type CreateAddressResponse = SuccessResponse<{
  address: OriginalAddress
}>

export type GetAllProvincesResponse = SuccessResponse<{
  provinces: ProvinceItem[]
  totalRows: number
}>

export type GetDistrictsResponse = SuccessResponse<{
  districts: DistrictItem[]
  totalRows: number
}>

export type GetWardsResponse = SuccessResponse<{
  wards: WardItem[]
  totalRows: number
}>

export type GetStreetsResponse = SuccessResponse<{
  streets: StreetItem[]
  totalRows: number
}>

export type GetAddressesResponse = SuccessResponse<{
  addresses: AddressItem[]
  pagination: Pagination
}>

export type GetAddressResponse = SuccessResponse<{
  address: AddressItem
}>
