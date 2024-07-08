'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import { ChevronLeft, Loader2, PlusCircle, Trash2, Upload } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import productsApis from '@/apis/products.apis'
import { approvalStatuses } from '@/app/(admin)/_columns/products.columns'
import CreateBrandForm from '@/app/(admin)/_components/create-brand-form'
import CreateProductCategoryForm from '@/app/(admin)/_components/create-product-category-form'
import InputFile from '@/components/input-file'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { ProductStatus } from '@/constants/enum'
import useAllBrands from '@/hooks/useAllBrands'
import useAllProductCategories from '@/hooks/useAllProductCategories'
import useUploadImage from '@/hooks/useUploadImage'
import { convertMomentToVietnamese, htmlToMarkdown } from '@/lib/utils'
import { CreateProductSchema, createProductSchema } from '@/rules/products.rules'
import { CreateProductReqBody } from '@/types/products.types'
import Editor from '@/components/editor'
import { Label } from '@/components/ui/label'

type CreateProductFormProps = {
  productId?: string
}

export default function CreateProductForm({ productId }: CreateProductFormProps) {
  const router = useRouter()

  const isUpdateMode = !!productId

  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null)
  const [photoFiles, setPhotoFiles] = React.useState<File[]>([])
  const [photoIds, setPhotoIds] = React.useState<string[]>([])
  const [isOpenCreateProductCategoryDialog, setIsOpenCreateProductCategoryDialog] = React.useState<boolean>(false)
  const [isOpenCreateBrandDialog, setIsOpenCreateBrandDialog] = React.useState<boolean>(false)
  const [markdownDescription, setMarkdownDescription] = React.useState<string>('')
  const [markdownShortDescription, setMarkdownShortDescription] = React.useState<string>('')

  const previewThumbnail = React.useMemo(
    () => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : null),
    [thumbnailFile]
  )
  const previewPhotos = React.useMemo(
    () => (photoFiles.length > 0 ? photoFiles.map((file) => URL.createObjectURL(file)) : []),
    [photoFiles]
  )

  const handleChangeThumbnail = (files: File[] | undefined) => {
    if (!files || !files[0]) return
    setThumbnailFile(files[0])
  }

  const handleMergePhotos = (files: File[] | undefined) => {
    if (!files) return
    setPhotoFiles((prevState) => [...prevState, ...files])
  }

  const handleDeletePreviewPhoto = (previewPhoto: string) => {
    const photoIndex = previewPhotos.findIndex((photo) => photo === previewPhoto)
    setPhotoFiles((prevState) => prevState.filter((_, index) => index !== photoIndex))
  }

  const handleDeletePhoto = (inputPhotoId: string) => {
    setPhotoIds((prevState) => prevState.filter((photoId) => photoId !== inputPhotoId))
  }

  const { productCategories } = useAllProductCategories()
  const { allBrands } = useAllBrands()
  const { uploadImageMutation } = useUploadImage()

  const getProductForUpdateQuery = useQuery({
    queryKey: ['getProductForUpdate', productId],
    queryFn: () => productsApis.getProductForUpdate(productId as string),
    enabled: !!productId
  })

  const product = React.useMemo(
    () => getProductForUpdateQuery.data?.data.data.product,
    [getProductForUpdateQuery.data?.data.data.product]
  )

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      productCategoryId: '',
      brandId: '',
      name: '',
      shortDescription: '',
      description: '',
      originalPrice: '',
      priceAfterDiscount: '',
      status: String(ProductStatus.Active),
      orderNumber: '0',
      specifications: [
        {
          key: '',
          value: ''
        }
      ]
    }
  })

  const handleFillDataIntoTheForm = React.useCallback(() => {
    if (!product) return
    const {
      name,
      shortDescription,
      description,
      orderNumber,
      originalPrice,
      priceAfterDiscount,
      status,
      category,
      brand,
      photos,
      specifications
    } = product
    const { setValue } = form
    setValue('name', name)
    setValue('orderNumber', String(orderNumber))
    setValue('originalPrice', String(originalPrice))
    setValue('priceAfterDiscount', String(priceAfterDiscount))
    setValue('status', String(status))
    setValue('productCategoryId', category._id)
    setValue('brandId', brand._id)
    setValue('shortDescription', shortDescription)
    setValue('description', description)
    setValue(
      'specifications',
      specifications?.map((item) => ({ key: item.key, value: item.value }))
    )

    setPhotoIds(photos.map((photo) => photo._id))
    setMarkdownDescription(htmlToMarkdown(description))
    setMarkdownShortDescription(htmlToMarkdown(shortDescription))
  }, [form, product])

  // UPDATE FORM DATA (UPDATE MODE)
  React.useEffect(() => {
    handleFillDataIntoTheForm()
  }, [handleFillDataIntoTheForm])

  const spectifications = useFieldArray({
    name: 'specifications',
    control: form.control
  })

  const createProductMutation = useMutation({
    mutationKey: ['createProduct'],
    mutationFn: productsApis.createProduct,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setThumbnailFile(null)
      setPhotoFiles([])
      form.setValue('productCategoryId', '')
      form.setValue('brandId', '')
    }
  })

  const updateProductMutation = useMutation({
    mutationKey: ['updateProduct'],
    mutationFn: productsApis.updateProduct,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getProductForUpdateQuery.refetch()
      setThumbnailFile(null)
      setPhotoFiles([])
    }
  })

  const isFormPending =
    uploadImageMutation.isPending || createProductMutation.isPending || updateProductMutation.isPending

  const handleCancel = () => {
    setThumbnailFile(null)
    setPhotoFiles([])
    if (!isUpdateMode) {
      form.reset()
      return
    }
    handleFillDataIntoTheForm()
    form.clearErrors()
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!isUpdateMode && (!thumbnailFile || photoFiles.length === 0)) return // REQUIRED WHEN CREATE MODE
    let thumbnailId = product?.thumbnail._id || ''
    let photoIdsConfig: string[] = photoIds
    if (thumbnailFile) {
      const form = new FormData()
      form.append('image', thumbnailFile)
      const res = await uploadImageMutation.mutateAsync(form)
      thumbnailId = res.data.data.images[0]._id
    }
    if (photoFiles.length > 0) {
      const form = new FormData()
      photoFiles.forEach((file) => {
        form.append('image', file)
      })
      const res = await uploadImageMutation.mutateAsync(form)
      photoIdsConfig = [...photoIdsConfig, ...res.data.data.images.map((image) => image._id)]
    }
    const body: CreateProductReqBody = {
      ...data,
      orderNumber: Number(data.orderNumber),
      originalPrice: Number(data.originalPrice),
      priceAfterDiscount: Number(data.priceAfterDiscount),
      status: Number(data.status),
      thumbnail: thumbnailId,
      photos: photoIdsConfig,
      specifications: data.specifications && data.specifications.length > 0 ? data.specifications : undefined
    }
    if (!isUpdateMode) {
      createProductMutation.mutate(body)
      return
    }
    updateProductMutation.mutate({ body, productId })
  })

  return (
    <React.Fragment>
      <Form {...form}>
        <form onSubmit={handleSubmit}>
          <div className='flex items-center space-x-3'>
            <Button type='button' size='icon' variant='outline' className='w-8 h-8' onClick={() => router.back()}>
              <ChevronLeft size={16} />
            </Button>
            <div className='flex items-center space-x-3'>
              <h1 className='text-xl tracking-tight font-semibold'>{!product ? 'Tạo sản phẩm mới' : product.name}</h1>
              {product && approvalStatuses[product.approvalStatus]}
            </div>
          </div>
          <div className='grid grid-cols-12 gap-5 mt-10'>
            <div className='col-span-3'>
              {/* THUMBNAIL AND PHOTO */}
              <Card>
                <CardHeader>
                  <CardTitle>Hình ảnh sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className='grid gap-2'>
                  {/* THUMBNAIL IS NOT UPLOADED */}
                  {!previewThumbnail && !product?.thumbnail && (
                    <InputFile onChange={(files) => handleChangeThumbnail(files)}>
                      <div className='aspect-square bg-muted rounded-lg flex justify-center items-center hover:cursor-pointer'>
                        <Upload size={40} strokeWidth={1.5} />
                      </div>
                    </InputFile>
                  )}
                  {/* THUMBNAIL IS UPLOADED */}
                  {(!!previewThumbnail || !!product?.thumbnail) && (
                    <div className='relative'>
                      <Image
                        width={200}
                        height={200}
                        src={previewThumbnail || product?.thumbnail.url || ''}
                        alt={product?.name || ''}
                        className='w-full h-full aspect-square rounded-lg object-cover'
                      />
                      <div className='absolute inset-x-0 bottom-0 bg-muted/50 p-2 flex justify-end rounded-b-lg'>
                        <InputFile onChange={(files) => handleChangeThumbnail(files)}>
                          <Button type='button' size='sm' variant='secondary'>
                            Đổi ảnh khác
                          </Button>
                        </InputFile>
                      </div>
                    </div>
                  )}
                  {/* THUMBNAIL ERROR MESSAGE */}
                  {!thumbnailFile && form.formState.isSubmitted && !isUpdateMode && (
                    <p className='text-xs text-destructive font-medium text-[0.8rem]'>
                      Ảnh đại diện sản phẩm là bắt buộc.
                    </p>
                  )}
                  {/* PHOTOS */}
                  <div className='grid gap-2 grid-cols-12'>
                    {/* PHOTOS UPLOADED */}
                    {[...(product?.photos || []).filter((photo) => photoIds.includes(photo._id)), ...previewPhotos].map(
                      (photo, index) => {
                        const isPreview = typeof photo === 'string'
                        return (
                          <div key={index} className='col-span-4 relative group'>
                            <Image
                              width={100}
                              height={100}
                              src={isPreview ? photo : photo.url}
                              alt={isPreview ? '' : product?.name || ''}
                              className='w-full aspect-square object-cover rounded-lg'
                            />
                            <div className='absolute inset-x-0 bottom-0 bg-muted/50 p-1 flex justify-end opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto'>
                              <Button
                                type='button'
                                size='icon'
                                variant='destructive'
                                className='w-7 h-7'
                                onClick={() =>
                                  isPreview ? handleDeletePreviewPhoto(photo) : handleDeletePhoto(photo._id)
                                }
                              >
                                <Trash2 size={16} strokeWidth={1.5} />
                              </Button>
                            </div>
                          </div>
                        )
                      }
                    )}
                    {/* UPLOAD PHOTOS */}
                    <div className='col-span-4'>
                      <InputFile multiple onChange={(files) => handleMergePhotos(files)}>
                        <div className='aspect-square border border-dashed rounded-lg flex justify-center items-center hover:cursor-pointer'>
                          <Upload strokeWidth={1.5} />
                        </div>
                      </InputFile>
                    </div>
                  </div>
                  {/* PHOTOS ERROR MESSAGE */}
                  {photoFiles.length === 0 && form.formState.isSubmitted && !isUpdateMode && (
                    <p className='text-xs text-destructive font-medium text-[0.8rem]'>Hình ảnh sản phẩm là bắt buộc.</p>
                  )}
                </CardContent>
              </Card>
            </div>
            <div className='col-span-6 grid gap-5'>
              {/* INFO AND DESCRIPTION */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông tin sản phẩm</CardTitle>
                  <CardDescription>Thông tin cơ bản sản phẩm</CardDescription>
                </CardHeader>
                <CardContent className='space-y-8'>
                  {/* NAME */}
                  <FormField
                    control={form.control}
                    name='name'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tên sản phẩm</FormLabel>
                        <FormControl>
                          <Input type='text' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* ORDER NUMBER */}
                  <FormField
                    control={form.control}
                    name='orderNumber'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Thứ tự sắp xếp sản phẩm</FormLabel>
                        <FormControl>
                          <Input type='text' {...field} />
                        </FormControl>
                        <FormDescription>
                          Thứ tự sắp xếp càng nhỏ thì sản phẩm càng được ưu tiên đưa lên đầu.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* SHORT DESCRIPTION */}
                  <div className='space-y-2'>
                    <Label>Mô tả ngắn sản phẩm</Label>
                    <Editor
                      value={markdownShortDescription}
                      onChange={({ html, text }) => {
                        form.setValue('shortDescription', html)
                        !!text && setMarkdownShortDescription(text)
                      }}
                    />
                  </div>
                  {/* DESCRIPTION */}
                  <div className='space-y-2'>
                    <Label>Mô tả sản phẩm</Label>
                    <Editor
                      value={markdownDescription}
                      onChange={({ html, text }) => {
                        form.setValue('description', html)
                        !!text && setMarkdownDescription(text)
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
              {/* PRICE */}
              <Card>
                <CardHeader>
                  <CardTitle>Giá cả sản phẩm</CardTitle>
                </CardHeader>
                <CardContent className='space-y-8'>
                  {/* ORIGINAL PRICE */}
                  <FormField
                    control={form.control}
                    name='originalPrice'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá gốc sản phẩm</FormLabel>
                        <FormControl>
                          <Input type='text' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* PRICE AFTER DISCOUNT */}
                  <FormField
                    control={form.control}
                    name='priceAfterDiscount'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Giá sản phẩm sau khi giảm</FormLabel>
                        <FormControl>
                          <Input type='text' {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              {/* SPECIFICATIONS */}
              <Card>
                <CardHeader>
                  <CardTitle>Thông số kỹ thuật</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='grid grid-cols-9 gap-5'>
                    <div className='col-span-4 text-muted-foreground font-medium text-sm'>Tên thông số</div>
                    <div className='col-span-4 text-muted-foreground font-medium text-sm'>Giá trị thông số</div>
                    {/* SPECIFICATIONS */}
                    {spectifications.fields.map((_, index) => (
                      <React.Fragment key={index}>
                        <div className='col-span-4'>
                          <FormField
                            control={form.control}
                            name={`specifications.${index}.key`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type='text' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='col-span-4'>
                          <FormField
                            control={form.control}
                            name={`specifications.${index}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input type='text' {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className='col-span-1 flex justify-center items-center'>
                          <Button
                            type='button'
                            size='icon'
                            variant='ghost'
                            onClick={() => spectifications.remove(index)}
                          >
                            <Trash2 size={18} strokeWidth={1.5} className='stroke-muted-foreground' />
                          </Button>
                        </div>
                      </React.Fragment>
                    ))}
                  </div>
                  <div className='flex justify-center mt-5'>
                    <Button
                      type='button'
                      size='sm'
                      variant='ghost'
                      className='capitalize'
                      onClick={() =>
                        spectifications.append({
                          key: '',
                          value: ''
                        })
                      }
                    >
                      <PlusCircle size={16} className='mr-2' />
                      Thêm thông số kỹ thuật
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <div className='flex justify-center space-x-2'>
                <Button variant='outline' type='button' size='sm' className='capitalize' onClick={handleCancel}>
                  Hủy bỏ
                </Button>
                <Button type='submit' size='sm' disabled={isFormPending} className='capitalize'>
                  {isFormPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
                  {!isUpdateMode ? 'Tạo sản phẩm' : 'Cập nhật sản phẩm'}
                </Button>
              </div>
            </div>
            <div className='col-span-3'>
              <div className='grid gap-5'>
                {/* STATUS */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trạng thái sản phẩm</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-8'>
                    {/* STATUS */}
                    <FormField
                      control={form.control}
                      name='status'
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Trạng thái hoạt động</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder='Chọn trạng thái hoạt động' />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {[
                                {
                                  value: ProductStatus.Active.toString(),
                                  name: 'Đang hoạt động'
                                },
                                {
                                  value: ProductStatus.Inactive.toString(),
                                  name: 'Không hoạt động'
                                }
                              ].map((item, index) => (
                                <SelectItem key={index} value={item.value}>
                                  {item.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
                {/* CATEGORY AND BRAND */}
                <Card>
                  <CardHeader>
                    <CardTitle>Danh mục và thương hiệu</CardTitle>
                  </CardHeader>
                  <CardContent className='space-y-8'>
                    <div className='space-y-3'>
                      {/* PRODUCT CATEGORY */}
                      <FormField
                        control={form.control}
                        name='productCategoryId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Danh mục sản phẩm</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Chọn danh mục sản phẩm' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {productCategories.map((productCategory) => (
                                  <SelectItem key={productCategory._id} value={productCategory._id}>
                                    {productCategory.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type='button'
                        size='sm'
                        variant='ghost'
                        onClick={() => setIsOpenCreateProductCategoryDialog(true)}
                      >
                        <PlusCircle size={16} className='mr-2' />
                        Thêm danh mục sản phẩm
                      </Button>
                    </div>
                    <div className='space-y-3'>
                      {/* BRAND */}
                      <FormField
                        control={form.control}
                        name='brandId'
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Thương hiệu</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder='Chọn thương hiệu' />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {allBrands.map((brand) => (
                                  <SelectItem key={brand._id} value={brand._id}>
                                    {brand.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type='button' size='sm' variant='ghost' onClick={() => setIsOpenCreateBrandDialog(true)}>
                        <PlusCircle size={16} className='mr-2' />
                        Thêm thương hiệu
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                {/* OTHER INFOS */}
                {product && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Thông tin khác</CardTitle>
                    </CardHeader>
                    <CardContent className='text-sm space-y-5'>
                      <div className='space-y-2'>
                        <div>Tạo lúc:</div>
                        <div>
                          {moment(product.createdAt).format('DD-MM-YYYY')} (
                          {convertMomentToVietnamese(moment(product.createdAt).fromNow())})
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <div>Cập nhật lúc:</div>
                        <div>
                          {moment(product.updatedAt).format('DD-MM-YYYY')} (
                          {convertMomentToVietnamese(moment(product.updatedAt).fromNow())})
                        </div>
                      </div>
                      <div className='space-y-2'>
                        <div>Tác giả:</div>
                        <div className='flex items-center space-x-2'>
                          <Avatar>
                            <AvatarImage src={product.author.avatar} />
                            <AvatarFallback>
                              {product.author.fullName[0].toUpperCase()}
                              {product.author.fullName[1].toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            {product.author.email} ({product.author.fullName})
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </form>
      </Form>
      {/* CREATE PRODUCT CATEGORY DIALOG */}
      <Dialog
        open={isOpenCreateProductCategoryDialog}
        onOpenChange={(value) => setIsOpenCreateProductCategoryDialog(value)}
      >
        <DialogContent className='max-h-screen overflow-y-auto max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Tạo danh mục sản phẩm mới</DialogTitle>
          </DialogHeader>
          <CreateProductCategoryForm onCreateSuccess={() => setIsOpenCreateProductCategoryDialog(false)} />
        </DialogContent>
      </Dialog>
      {/* CREATE BRAND DIALOG */}
      <Dialog open={isOpenCreateBrandDialog} onOpenChange={(value) => setIsOpenCreateBrandDialog(value)}>
        <DialogContent className='max-h-screen overflow-y-auto max-w-3xl'>
          <DialogHeader>
            <DialogTitle>Tạo thương hiệu mới</DialogTitle>
          </DialogHeader>
          <CreateBrandForm onCreateSuccess={() => setIsOpenCreateBrandDialog(false)} />
        </DialogContent>
      </Dialog>
    </React.Fragment>
  )
}
