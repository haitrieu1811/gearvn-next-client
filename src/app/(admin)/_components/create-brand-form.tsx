import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { AxiosResponse } from 'axios'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { CloudUpload, Loader2 } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import brandsApis from '@/apis/brands.apis'
import InputFile from '@/components/input-file'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { BrandStatus } from '@/constants/enum'
import useUploadImage from '@/hooks/useUploadImage'
import { CreateBrandSchema, createBrandSchema } from '@/rules/brands.rules'
import { CreateBrandResponse, UpdateBrandResponse } from '@/types/brands.types'

type CreateBrandFormProps = {
  brandId?: string
  onCreateSuccess?: (data: AxiosResponse<CreateBrandResponse, any>) => void
  onUpdateSuccess?: (data: AxiosResponse<UpdateBrandResponse, any>) => void
}

export default function CreateBrandForm({ brandId, onCreateSuccess, onUpdateSuccess }: CreateBrandFormProps) {
  const isUpdateMode = !!brandId

  const queryClient = useQueryClient()

  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null)

  const thumbnailPreview = React.useMemo(
    () => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : null),
    [thumbnailFile]
  )

  const { uploadImageMutation } = useUploadImage()

  const handleChangeThumbnailFile = (files: File[] | undefined) => {
    if (!files) return
    setThumbnailFile(files[0])
  }

  const form = useForm<CreateBrandSchema>({
    resolver: zodResolver(createBrandSchema),
    defaultValues: {
      name: '',
      description: '',
      orderNumber: '0',
      status: BrandStatus.Active.toString()
    }
  })

  const getBrandByIdQuery = useQuery({
    queryKey: ['getBrandById', brandId],
    queryFn: () => brandsApis.getBrandById(brandId as string),
    enabled: !!brandId
  })

  const brand = React.useMemo(() => getBrandByIdQuery.data?.data.data.brand, [getBrandByIdQuery.data?.data.data.brand])

  // HANDLE FILL DATA INTO THE FORM
  const handleFillDataInTheForm = React.useCallback(() => {
    if (!brand) return
    const { setValue } = form
    const { name, description, orderNumber, status } = brand
    setValue('name', name)
    setValue('description', description)
    setValue('orderNumber', String(orderNumber))
    setValue('status', String(status))
  }, [brand, form])

  // UPDATE FORM DATA WHEN IN UPDATE MODE
  React.useEffect(() => {
    handleFillDataInTheForm()
  }, [handleFillDataInTheForm])

  const createBrandMutation = useMutation({
    mutationKey: ['createBrand'],
    mutationFn: brandsApis.createBrand,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setThumbnailFile(null)
      queryClient.invalidateQueries({ queryKey: ['getAllBrands'] })
      onCreateSuccess && onCreateSuccess(data)
    }
  })

  const updateBrandMutation = useMutation({
    mutationKey: ['updateBrand'],
    mutationFn: brandsApis.updateBrand,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getBrandByIdQuery.refetch()
      thumbnailFile && setThumbnailFile(null)
      queryClient.invalidateQueries({ queryKey: ['getAllBrands'] })
      onUpdateSuccess && onUpdateSuccess(data)
    }
  })

  const isPendingForm = uploadImageMutation.isPending || createBrandMutation.isPending || updateBrandMutation.isPending

  const handleCancel = () => {
    setThumbnailFile(null)
    if (!isUpdateMode) {
      form.reset()
      return
    }
    handleFillDataInTheForm()
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    let thumbnailId: string | undefined = undefined
    if (thumbnailFile) {
      const form = new FormData()
      form.append('image', thumbnailFile)
      try {
        const res = await uploadImageMutation.mutateAsync(form)
        const image = res.data.data.images[0]
        thumbnailId = image._id
      } catch (error) {
        console.log(error)
      }
    }
    if (!isUpdateMode) {
      if (!thumbnailId) return
      createBrandMutation.mutate({
        ...data,
        status: Number(data.status),
        orderNumber: Number(data.orderNumber),
        thumbnail: thumbnailId
      })
    } else {
      const { name, description, orderNumber, status } = data
      const body = omitBy(
        {
          name: name !== brand?.name ? name : undefined,
          description: description !== brand?.description ? description : undefined,
          orderNumber: Number(orderNumber) !== brand?.orderNumber ? Number(orderNumber) : undefined,
          status: Number(status) !== brand?.status ? Number(status) : undefined,
          thumbnail: thumbnailId
        },
        isUndefined
      )
      updateBrandMutation.mutate({
        body,
        brandId
      })
    }
  })

  return (
    <div className='grid grid-cols-12 gap-5'>
      <div className='col-span-4'>
        {/* THUMBNAIL OF BRAND */}
        <div className='flex flex-col items-center space-y-5 py-10'>
          {/* SHOWN WHEN THE PHOTO IS NOT UPLOADED */}
          {!thumbnailPreview && !brand?.thumbnail && <div className='w-[100px] h-[100px] rounded-full bg-muted' />}
          {/* DISPLAY WHEN PREVIEW IMAGE IS AVAILABLE */}
          {!!thumbnailPreview && (
            <Image
              width={100}
              height={100}
              src={thumbnailPreview}
              alt=''
              className='aspect-square object-cover rounded-full'
            />
          )}
          {/* SHOWN WHEN BRAND HAS REPRESENTED THUMBNAIL AND NO PREVIEW IMAGE */}
          {!!brand?.thumbnail && !thumbnailPreview && (
            <Image
              width={100}
              height={100}
              src={brand.thumbnail}
              alt={brand.name}
              className='aspect-square object-cover rounded-full'
            />
          )}
          {/* ERROR MESSAGE */}
          {!thumbnailFile && form.formState.isSubmitted && !isUpdateMode && (
            <p className='text-[0.8rem] text-destructive font-medium text-center'>
              Hình đại diện thương hiệu là bắt buộc.
            </p>
          )}
          {/* INPUT FILE */}
          <InputFile onChange={(files) => handleChangeThumbnailFile(files)}>
            <Button variant='outline'>
              <CloudUpload size={16} strokeWidth={1.5} className='mr-2' />
              {!isUpdateMode ? 'Tải ảnh lên' : 'Thay đổi ảnh'}
            </Button>
          </InputFile>
        </div>
      </div>
      <div className='col-span-8'>
        <Form {...form}>
          <form className='space-y-8' onSubmit={handleSubmit}>
            {/* NAME */}
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tên thương hiệu</FormLabel>
                  <FormControl>
                    <Input type='text' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* DESCRIPTION */}
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mô tả thương hiệu</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='grid grid-cols-12 gap-5'>
              <div className='col-span-6'>
                {/* ORDER NUMBER */}
                <FormField
                  control={form.control}
                  name='orderNumber'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thứ tự sắp xếp</FormLabel>
                      <FormControl>
                        <Input type='text' {...field} />
                      </FormControl>
                      <FormDescription>
                        Thứ tự sắp xếp càng nhỏ thì thương hiệu càng được đưa lên trước tên.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='col-span-6'>
                {/* STATUS */}
                <FormField
                  control={form.control}
                  name='status'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder='Select a verified email to display' />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {[
                            {
                              value: String(BrandStatus.Active),
                              name: 'Hoạt động'
                            },
                            {
                              value: String(BrandStatus.Inactive),
                              name: 'Ngừng hoạt động'
                            }
                          ].map((item) => (
                            <SelectItem key={item.value} value={item.value}>
                              {item.name}
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
            <div className='flex space-x-2'>
              {/* CANCEL */}
              <Button type='button' variant='outline' className='flex-auto uppercase' onClick={handleCancel}>
                Hủy bỏ
              </Button>
              {/* SUBMIT */}
              <Button disabled={isPendingForm} className='flex-auto uppercase'>
                {isPendingForm && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                {!isUpdateMode ? 'Thêm thương hiệu' : 'Cập nhật thương hiệu'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}
