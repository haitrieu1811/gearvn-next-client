'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import isEqual from 'lodash/isEqual'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { CircleX, Loader2, Star, Upload } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { toast } from 'sonner'

import reviewsApis from '@/apis/reviews.apis'
import InputFile from '@/components/input-file'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import useUploadImage from '@/hooks/useUploadImage'
import { cn } from '@/lib/utils'
import { ProductItem } from '@/types/products.types'
import { StarPointType } from '@/types/reviews.types'

type ReviewDialogProps = {
  triggerElement?: React.ReactNode
  product: ProductItem
  reviewId?: string
  isOpenDialog?: boolean
  onOpenChange?: (value: boolean) => void
}

const MAX_PHOTOS = 5

export default function ReviewDialog({
  triggerElement,
  product,
  reviewId,
  isOpenDialog = false,
  onOpenChange
}: ReviewDialogProps) {
  const isUpdateMode = !!reviewId

  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = React.useState<boolean>(false)
  const [starPoint, setStarPoint] = React.useState<StarPointType | 0>(0)
  const [starMessage, setStarMessage] = React.useState<string>('Click vào để review!')
  const [content, setContent] = React.useState<string>('')
  const [photoFiles, setPhotoFiles] = React.useState<File[]>([])
  const [photoIds, setPhotoIds] = React.useState<string[]>([])

  const previewPhotos = React.useMemo(() => photoFiles.map((photoFile) => URL.createObjectURL(photoFile)), [photoFiles])

  const handleMergePhotos = (files: File[] | undefined) => {
    if (!files) return
    setPhotoFiles((prevState) => [...prevState, ...files])
  }

  const handleDeletePreviewPhoto = (previewPhoto: string) => {
    const previewPhotoIndex = previewPhotos.findIndex((photo) => photo === previewPhoto)
    setPhotoFiles((prevState) => prevState.filter((_, index) => index !== previewPhotoIndex))
  }

  const handleDeletePhoto = (photoId: string) => {
    setPhotoIds((prevState) => prevState.filter((item) => item !== photoId))
  }

  const getReviewQuery = useQuery({
    queryKey: ['getReview'],
    queryFn: () => reviewsApis.getReviewById(reviewId as string),
    enabled: !!reviewId
  })

  const review = React.useMemo(() => getReviewQuery.data?.data.data.review, [getReviewQuery.data?.data.data.review])

  React.useEffect(() => {
    if (!review) return
    const { starPoint, content, photos } = review
    starPoint && setStarPoint(starPoint)
    setContent(content)
    setPhotoIds(photos.map((photo) => photo._id))
  }, [review])

  const totalPhoto = photoFiles.length + photoIds.length
  const isValid = totalPhoto <= 5 && !!starPoint

  const { uploadImageMutation } = useUploadImage()

  const createReviewMutation = useMutation({
    mutationKey: ['createReview'],
    mutationFn: reviewsApis.createReview,
    onSuccess: (data) => {
      setIsOpen(false)
      setPhotoFiles([])
      toast.success(data.data.message)
      queryClient.invalidateQueries({ queryKey: ['getReviewsByProductId', product._id] })
      queryClient.invalidateQueries({ queryKey: ['getProductForRead', product._id] })
    }
  })

  const updateReviewMutation = useMutation({
    mutationKey: ['updateReview'],
    mutationFn: reviewsApis.updateReview,
    onSuccess: (data) => {
      setIsOpen(false)
      setPhotoFiles([])
      toast.success(data.data.message)
      getReviewQuery.refetch()
      queryClient.invalidateQueries({ queryKey: ['getReviewsByProductId', product._id] })
      queryClient.invalidateQueries({ queryKey: ['getProductForRead', product._id] })
    }
  })

  const isPending = uploadImageMutation.isPending || createReviewMutation.isPending || updateReviewMutation.isPending

  const handleSubmit = async () => {
    if (!isValid) return
    let photos: string[] = photoIds
    if (photoFiles.length > 0) {
      const form = new FormData()
      photoFiles.forEach((file) => {
        form.append('image', file)
      })
      const res = await uploadImageMutation.mutateAsync(form)
      photos = photos.concat(res.data.data.images.map((image) => image._id))
    }
    if (!isUpdateMode) {
      createReviewMutation.mutate({
        body: {
          starPoint,
          content,
          photos: photos.length > 0 ? photos : undefined
        },
        productId: product._id
      })
      return
    }
    const body = omitBy(
      {
        content: content !== review?.content ? content : undefined,
        starPoint: starPoint !== review?.starPoint ? starPoint : undefined,
        photos: !isEqual(
          photos,
          review?.photos.map((photo) => photo._id)
        )
          ? photos
          : undefined
      },
      isUndefined
    )
    updateReviewMutation.mutate({
      body,
      reviewId
    })
  }

  React.useEffect(() => {
    switch (starPoint) {
      case 1:
        setStarMessage('Rất không hài lòng')
        break
      case 2:
        setStarMessage('Không hài lòng')
        break
      case 3:
        setStarMessage('Bình thường')
        break
      case 4:
        setStarMessage('Tốt')
        break
      case 5:
        setStarMessage('Xuất sắc')
        break
      default:
        break
    }
  }, [starPoint])

  return (
    <Dialog
      open={isOpen || isOpenDialog}
      onOpenChange={(value) => {
        setIsOpen(value)
        onOpenChange && onOpenChange(value)
      }}
    >
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className='max-w-4xl max-h-screen overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Đánh giá của bạn về {product.name}</DialogTitle>
        </DialogHeader>
        <div className='flex pt-3'>
          {/* PRODUCT INFO */}
          <div className='bg-main w-1/4 rounded-md space-y-3'>
            <div className='p-2'>
              <Image
                width={500}
                height={500}
                src={product.thumbnail.url || ''}
                className='w-full aspect-square object-cover rounded-md'
                alt=''
              />
            </div>
            <div className='text-sm text-white text-center font-medium px-3'>{product.name}</div>
          </div>
          {/* REVIEW FORM */}
          <div className='flex-1 space-y-5 pl-5'>
            {/* STAR POINT */}
            <div className='flex justify-between items-center'>
              <div className='flex items-center space-x-3'>
                <Label className='font-semibold'>Mức độ đánh giá</Label>
                <div className='flex space-x-px'>
                  {Array(5)
                    .fill(0)
                    .map((_, index) => {
                      const _starPoint = (index + 1) as StarPointType
                      const isActive = _starPoint <= starPoint
                      return (
                        <div
                          key={index}
                          className={cn('first:rounded-l last:rounded-r p-1 hover:cursor-pointer', {
                            'bg-muted hover:bg-main': !isActive,
                            'bg-main': isActive
                          })}
                          onMouseEnter={() => setStarPoint(_starPoint)}
                        >
                          <Star size={16} className='stroke-transparent fill-white' />
                        </div>
                      )
                    })}
                </div>
                <div className='text-xs'>{starMessage}</div>
              </div>
              <div
                className={cn('flex items-center space-x-3 px-2 py-1 rounded-full border pointer-events-none', {
                  'opacity-0': !!starPoint,
                  'opacity-100': !starPoint
                })}
              >
                <div className='text-xs text-destructive'>Vui lòng chọn mức độ đánh giá</div>
                <CircleX className='fill-main stroke-white dark:stroke-black' />
              </div>
            </div>
            {/* CONTENT */}
            <div className='space-y-2'>
              <Label htmlFor='content' className='font-semibold'>
                Đánh giá
              </Label>
              <Textarea
                id='content'
                rows={5}
                value={content}
                placeholder='Ví dụ: Tôi đã mua sản phẩm cách đây 1 tháng và rất hài lòng về nó ...'
                className='text-[13px] resize-none'
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            {/* PHOTOS */}
            <div className='grid grid-cols-12 gap-2'>
              <InputFile
                multiple
                className='col-span-2 aspect-square border-[2px] border-dashed rounded-md flex flex-col justify-center items-center space-y-1 hover:cursor-pointer'
                onChange={(files) => handleMergePhotos(files)}
              >
                <Upload />
                <span className='text-xs capitalize'>Gửi ảnh</span>
              </InputFile>
              {[...(review?.photos || []).filter((photo) => photoIds.includes(photo._id)), ...previewPhotos].map(
                (photo) => {
                  const isPreview = typeof photo === 'string'
                  const key = isPreview ? photo : photo._id
                  return (
                    <div key={key} className='col-span-2 aspect-square relative'>
                      <button
                        className='absolute top-1 right-1'
                        onClick={() => (isPreview ? handleDeletePreviewPhoto(photo) : handleDeletePhoto(photo._id))}
                      >
                        <CircleX size={18} className='stroke-destructive' />
                      </button>
                      <Image
                        width={100}
                        height={100}
                        src={isPreview ? photo : photo.url}
                        className='w-full aspect-square object-cover rounded-md'
                        alt=''
                      />
                    </div>
                  )
                }
              )}
            </div>
            {/* ERROR MESSAGE */}
            {totalPhoto > MAX_PHOTOS && (
              <p className='text-[0.8rem] text-destructive font-medium'>Chỉ được gửi tối đa 5 hình ảnh</p>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button disabled={isPending} className='bg-main hover:bg-main-foreground' onClick={handleSubmit}>
            {isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
            {!isUpdateMode ? 'Gửi đánh giá' : 'Cập nhật đánh giá'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
