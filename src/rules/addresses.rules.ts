import z from 'zod'

import { PHONE_NUMBER_REGEX } from '@/constants/regex'
import { numberEnumToArray } from '@/lib/utils'
import { AddressType } from '@/constants/enum'

const addressTypes = numberEnumToArray(AddressType)

export const addressSchema = z.object({
  fullName: z.string().min(1, 'Họ và tên người nhận là bắt buộc.'),
  phoneNumber: z.string().regex(PHONE_NUMBER_REGEX, 'Số điện thoại người nhận không hợp lệ.'),
  provinceId: z.string().min(1, 'Tỉnh/thành phố là bắt buộc.'),
  districtId: z.string().min(1, 'Quận/huyện là bắt buộc.'),
  wardId: z.string().min(1, 'Phường/xã là bắt buộc.'),
  detailAddress: z.string().min(1, 'Địa chỉ chi tiết là bắt buộc.'),
  type: z.string().optional()
})

export const createAddressSchema = addressSchema
  .pick({
    fullName: true,
    phoneNumber: true,
    provinceId: true,
    districtId: true,
    wardId: true,
    detailAddress: true,
    type: true
  })
  .refine(
    (data) => {
      if (data.type) {
        return addressTypes.includes(Number(data.type))
      }
      return true
    },
    {
      message: 'Loại địa chỉ không hợp lệ.',
      path: ['type']
    }
  )

export type CreateAddressSchema = z.infer<typeof createAddressSchema>
