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
  onSuccess?: (data: AxiosResponse<CreateAddressResponse, any>) => void
}

export default function CreateAddressForm({ onSuccess }: CreateAddressFormProps) {
  const form = useForm<CreateAddressSchema>({
    resolver: zodResolver(createAddressSchema),
    defaultValues: {
      fullName: '',
      phoneNumber: '',
      provinceId: '',
      districtId: '',
      wardId: '',
      streetId: '',
      detailAddress: '',
      type: ''
    }
  })

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

  const getStreetsQuery = useQuery({
    queryKey: ['getStreets', provinceId, districtId],
    queryFn: () => addressesApis.getStreets({ provinceId, districtId }),
    enabled: !!(provinceId && districtId)
  })

  const streets = React.useMemo(
    () => getStreetsQuery.data?.data.data.streets || [],
    [getStreetsQuery.data?.data.data.streets]
  )

  React.useEffect(() => {
    const { setValue } = form
    setValue('districtId', '')
    setValue('wardId', '')
    setValue('streetId', '')
  }, [form, provinceId])

  React.useEffect(() => {
    const { setValue } = form
    setValue('wardId', '')
    setValue('streetId', '')
  }, [form, districtId])

  const createAddressMutation = useMutation({
    mutationKey: ['createAddress'],
    mutationFn: addressesApis.createAddress,
    onSuccess: (data) => {
      toast.success(data.data.message)
      onSuccess && onSuccess(data)
    }
  })

  const handleSubmit = form.handleSubmit((data) => {
    createAddressMutation.mutate({
      ...data,
      type: Number(data.type)
    })
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
            {/* STREET */}
            <FormField
              control={form.control}
              name='streetId'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên đường</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Chọn tên đường' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {streets.map((street) => (
                        <SelectItem key={street.id} value={street.id}>
                          {street.prefix} {street.name}
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
        <Button type='submit' disabled={createAddressMutation.isPending} className='w-full uppercase'>
          {createAddressMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
          Thêm địa chỉ
        </Button>
      </form>
    </Form>
  )
}
