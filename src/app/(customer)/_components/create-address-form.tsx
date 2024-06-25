import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import { Loader2 } from 'lucide-react'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import addressesApis from '@/apis/addresses.apis'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { AddressType } from '@/constants/enum'
import { CreateAddressSchema, createAddressSchema } from '@/rules/addresses.rules'
import { CreateAddressResponse } from '@/types/addresses.types'

type CreateAddressFormProps = {
  addressId?: string
  onCreateSuccess?: (data: AxiosResponse<CreateAddressResponse, any>) => void
  onUpdateSuccess?: (data: AxiosResponse<CreateAddressResponse, any>) => void
}

export default function CreateAddressForm({ addressId, onCreateSuccess, onUpdateSuccess }: CreateAddressFormProps) {
  const isUpdateMode = !!addressId

  const getAddressQuery = useQuery({
    queryKey: ['getAddress', addressId],
    queryFn: () => addressesApis.getAddress(addressId as string),
    enabled: !!addressId
  })

  const address = React.useMemo(
    () => getAddressQuery.data?.data.data.address,
    [getAddressQuery.data?.data.data.address]
  )

  const form = useForm<CreateAddressSchema>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      provinceId: '',
      districtId: '20',
      wardId: '',
      detailAddress: '',
      type: ''
    }
  })

  // FILL DATA INTO THE FORM (UPDATE MODE)
  React.useEffect(() => {
    if (!address) return
    const { setValue } = form
    const { fullName, phoneNumber, province, district, ward, detailAddress, type } = address
    // setValue('fullName', fullName)
    // setValue('phoneNumber', phoneNumber)
    // setValue('provinceId', province._id)
    // setValue('districtId', district.id)
    // setValue('wardId', ward.id)
    // setValue('streetId', street.id)
    // setValue('detailAddress', detailAddress)
    // setValue('type', type.toString())
    form.reset({ fullName, provinceId: province._id })
  }, [form, address])

  const provinceId = form.watch('provinceId')
  const districtId = form.watch('districtId')

  const getAllProvincesQuery = useQuery({
    queryKey: ['getAllProvinces'],
    queryFn: () => addressesApis.getAllProvinces(),
    staleTime: Infinity
  })

  const provinces = React.useMemo(
    () => getAllProvincesQuery.data?.data.data.provinces || [],
    [getAllProvincesQuery.data?.data.data.provinces]
  )

  const getDistrictsQuery = useQuery({
    queryKey: ['getDistricts', provinceId],
    queryFn: () => addressesApis.getDistricts(provinceId),
    enabled: !!provinceId
  })

  const districts = React.useMemo(
    () => getDistrictsQuery.data?.data.data.districts || [],
    [getDistrictsQuery.data?.data.data.districts]
  )

  const getWardsQuery = useQuery({
    queryKey: ['getWards', provinceId, districtId],
    queryFn: () => addressesApis.getWards({ provinceId, districtId }),
    enabled: !!(provinceId && districtId)
  })

  const wards = React.useMemo(() => getWardsQuery.data?.data.data.wards || [], [getWardsQuery.data?.data.data.wards])

  // RESET VALUE WHEN CHANGE PROVINCE/DISTRICT
  React.useEffect(() => {
    const { setValue } = form
    // setValue('districtId', '')
    // setValue('wardId', '')
    // setValue('streetId', '')
  }, [form, provinceId])
  React.useEffect(() => {
    const { setValue } = form
    // setValue('wardId', '')
    // setValue('streetId', '')
  }, [form, districtId])

  const createAddressMutation = useMutation({
    mutationKey: ['createAddress'],
    mutationFn: addressesApis.createAddress,
    onSuccess: (data) => {
      toast.success(data.data.message)
      onCreateSuccess && onCreateSuccess(data)
    }
  })

  const updateAddressMutation = useMutation({
    mutationKey: ['updateAddress'],
    mutationFn: addressesApis.updateAddress,
    onSuccess: (data) => {
      toast.success(data.data.message)
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const isFormPending = createAddressMutation.isPending || updateAddressMutation.isPending

  const handleSubmit = form.handleSubmit((data) => {
    const body = {
      ...data,
      type: Number(data.type)
    }
    if (!isUpdateMode) {
      createAddressMutation.mutate(body)
      return
    }
    updateAddressMutation.mutate({ body, addressId })
  })

  return (
    <Form {...form}>
      <form className='space-y-6' onSubmit={handleSubmit}>
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-6'>
            {/* FULLNAME */}
            <FormField
              control={form.control}
              name='fullName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ và tên</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
            {/* PHONE NUMBER */}
            <FormField
              control={form.control}
              name='phoneNumber'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Số điện thoại</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-6'>
            {/* PROVINCE */}
            <FormField
              control={form.control}
              name='provinceId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tỉnh/thành phố</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn tỉnh/thành phố' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {provinces.map((province) => (
                        <SelectItem key={province._id} value={province._id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
            {/* DISTRICT */}
            <FormField
              control={form.control}
              name='districtId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quận/huyện</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn quận huyện' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {districts.map((district) => (
                        <SelectItem key={district.id} value={district.id}>
                          {district.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className='grid grid-cols-12 gap-5'>
          <div className='col-span-6'>
            {/* WARD */}
            <FormField
              control={form.control}
              name='wardId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phường/xã</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn phường/xã' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {wards.map((ward) => (
                        <SelectItem key={ward.id} value={ward.id}>
                          {ward.prefix} {ward.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className='col-span-6'>
            {/* DETAIL ADDRESS */}
            <FormField
              control={form.control}
              name='detailAddress'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Địa chỉ chi tiết</FormLabel>
                  <FormControl>
                    <Input type='text' placeholder='Số nhà' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        {/* TYPE */}
        <FormField
          control={form.control}
          name='type'
          render={({ field }) => (
            <FormItem className='space-y-3'>
              <FormLabel>Loại địa chỉ</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  value={field.value}
                  className='flex flex-col space-y-1'
                >
                  {[
                    {
                      value: AddressType.Home.toString(),
                      label: 'Nhà riêng'
                    },
                    {
                      value: AddressType.Office.toString(),
                      label: 'Cơ quan'
                    },
                    {
                      value: AddressType.Other.toString(),
                      label: 'Khác'
                    }
                  ].map((item) => (
                    <FormItem key={item.value} className='flex items-center space-x-3 space-y-0'>
                      <FormControl>
                        <RadioGroupItem value={item.value} />
                      </FormControl>
                      <FormLabel className='font-normal'>{item.label}</FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* SUBMIT */}
        <Button type='submit' disabled={isFormPending} className='w-full uppercase'>
          {isFormPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          {!isUpdateMode ? 'Thêm địa chỉ' : 'Cập nhật địa chỉ'}
        </Button>
      </form>
    </Form>
  )
}
