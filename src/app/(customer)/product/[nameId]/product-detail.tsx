'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { ChevronDown, Loader2, Sparkles, Star } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import productsApis from '@/apis/products.apis'
import reviewsApis from '@/apis/reviews.apis'
import ReviewDialog from '@/app/(customer)/_components/review-dialog'
import QuantityController from '@/components/quantity-controller'
import ReviewItem from '@/components/review-item'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import PATH from '@/constants/path'
import useAddProductToCart from '@/hooks/useAddProductToCart'
import useIsClient from '@/hooks/useIsClient'
import usePosts from '@/hooks/usePosts'
import useProducts from '@/hooks/useProducts'
import useReviewsByProductId from '@/hooks/useReviewsByProductId'
import { cn, formatCurrency, rateSale } from '@/lib/utils'
import { AppContext } from '@/providers/app.provider'

type ProductDetailContext = {
  setCurrentUpdatedReviewId: React.Dispatch<React.SetStateAction<string | null>>
  setCurrentDeletedReviewId: React.Dispatch<React.SetStateAction<string | null>>
}

const initialContext: ProductDetailContext = {
  setCurrentUpdatedReviewId: () => null,
  setCurrentDeletedReviewId: () => null
}

export const ProductDetailContext = React.createContext<ProductDetailContext>(initialContext)

type ProductDetailProps = {
  productId: string
}

export default function ProductDetail({ productId }: ProductDetailProps) {
  const queryClient = useQueryClient()

  const [activePhoto, setActivePhoto] = React.useState<string | null>(null)
  const [currentUpdatedReviewId, setCurrentUpdatedReviewId] = React.useState<string | null>(null)
  const [currentDeletedReviewId, setCurrentDeletedReviewId] = React.useState<string | null>(null)
  const [quantity, setQuantity] = React.useState<number>(1)
  const [isViewingMore, setIsViewingMore] = React.useState<boolean>(false)

  const { isAuthenticated, loggedUser } = React.useContext(AppContext)

  const descriptionRef = React.useRef<HTMLDivElement>(null)

  const getProductForReadQuery = useQuery({
    queryKey: ['getProductForRead', productId],
    queryFn: () => productsApis.getProductForRead(productId)
  })

  const product = React.useMemo(
    () => getProductForReadQuery.data?.data.data.product,
    [getProductForReadQuery.data?.data.data.product]
  )

  React.useEffect(() => {
    if (!product) return
    setActivePhoto(product.photos[0].url)
  }, [product])

  const { products: sameProducts, getPublicProductsQuery } = useProducts({
    categoryId: product?.category._id,
    limit: '5'
  })
  const isClient = useIsClient()
  const { posts, getPublicPostsQuery } = usePosts({ limit: '5' })
  const { getReviewsByProductIdQuery, reviews } = useReviewsByProductId({ productId })

  const isReviewd = !!(loggedUser && reviews.map((review) => review.author._id).includes(loggedUser._id))

  const deleteReviewMutation = useMutation({
    mutationKey: ['deleteReview'],
    mutationFn: reviewsApis.deleteReview,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getReviewsByProductIdQuery.refetch()
      queryClient.invalidateQueries({ queryKey: ['getRepliesOfReview'] })
    }
  })

  const handleDeleteReview = () => {
    if (!currentDeletedReviewId) return
    deleteReviewMutation.mutate(currentDeletedReviewId)
  }

  const { handleAddProductToCart, addProductToCartMutation } = useAddProductToCart({
    onSuccess: () => {
      setQuantity(1)
    }
  })

  return (
    <ProductDetailContext.Provider
      value={{
        setCurrentUpdatedReviewId,
        setCurrentDeletedReviewId
      }}
    >
      {activePhoto && product ? (
        <div className='flex bg-background space-x-5 p-5'>
          {/* PHOTOS */}
          <div className='w-1/3 space-y-2'>
            <Image
              width={400}
              height={400}
              src={activePhoto}
              alt={product.name}
              className='rounded-md aspect-square object-cover'
            />
            <Carousel className='w-full'>
              <CarouselContent className='-ml-2'>
                {product.photos.map((photo) => (
                  <CarouselItem key={photo._id} className='pl-2 basis-1/5'>
                    <div
                      className={cn('border-[2px] rounded-md hover:cursor-pointer', {
                        'border-main': photo.url === activePhoto,
                        'border-transparent': photo.url !== activePhoto
                      })}
                      onClick={() => setActivePhoto(photo.url)}
                    >
                      <Image
                        width={100}
                        height={100}
                        src={photo.url}
                        className='w-full object-cover aspect-square rounded-md'
                        alt=''
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className='left-2' />
              <CarouselNext className='right-2' />
            </Carousel>
          </div>
          {/* INFOMATION */}
          <div className='flex-1 space-y-5'>
            {/* NAME */}
            <div className='space-y-1'>
              <h1 className='text-2xl font-semibold tracking-tight'>{product.name}</h1>
              <div className='flex items-center space-x-3'>
                <div className='text-yellow-500 flex items-center'>
                  {product.review.averageReview.toFixed(1)}
                  <Star size={14} className='fill-yellow-500 ml-1' />
                </div>
                <Link href='#review' className='text-sm text-blue-600 font-medium hover:underline'>
                  Xem đánh giá
                </Link>
              </div>
            </div>
            {/* PRICE - DISCOUNT */}
            <div className='flex items-center space-x-3'>
              <div className='text-3xl font-semibold text-main'>
                {formatCurrency(product.priceAfterDiscount)}&#8363;
              </div>
              {product.priceAfterDiscount < product.originalPrice && (
                <div className='text-xl text-muted-foreground line-through'>
                  {formatCurrency(product.originalPrice)}&#8363;
                </div>
              )}
              {product.priceAfterDiscount < product.originalPrice && (
                <Badge variant='outline' className='border-main text-main'>
                  -{rateSale(product.originalPrice, product.priceAfterDiscount)}%
                </Badge>
              )}
            </div>
            {/* QUANTITY */}
            <div className='flex items-center space-x-5'>
              <Label>Số lượng</Label>
              <QuantityController
                value={quantity}
                onChange={(value) => setQuantity(value)}
                onDecrease={(value) => setQuantity(value)}
                onIncrease={(value) => setQuantity(value)}
              />
            </div>
            {/* ADD PRODUCT TO CART */}
            <Button
              disabled={addProductToCartMutation.isPending}
              className='flex-col h-16 px-20 bg-main hover:bg-main-foreground'
              onClick={() => handleAddProductToCart({ productId: product._id, quantity })}
            >
              <div className='flex items-center'>
                {addProductToCartMutation.isPending && <Loader2 size={20} className='animate-spin mr-2' />}
                <span className='uppercase text-lg'>Mua ngay</span>
              </div>
              <span>Giao tận nơi hoặc nhận tại cửa hàng</span>
            </Button>
            {/* SHORT DESCRIPTION */}
            <div
              className='editor'
              dangerouslySetInnerHTML={{
                __html: DOMPurify.sanitize(product.shortDescription)
              }}
            />
          </div>
        </div>
      ) : (
        <div className='bg-background flex justify-center py-20'>
          <Loader2 strokeWidth={1} size={40} className='stroke-main animate-spin' />
        </div>
      )}
      <div className='flex space-x-5'>
        {/* DESCRIPTION */}
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='text-2xl'>Thông tin sản phẩm</CardTitle>
          </CardHeader>
          <CardContent>
            <h3 className='text-xl tracking-tight font-medium mb-5'>Thông số kỹ thuật</h3>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell>Cổng kết nối</TableCell>
                  <TableCell>
                    3x USB-A (USB 5Gbps / USB 3.2 Gen 1) 1x USB-C® (USB 10Gbps / USB 3.2 Gen 2), with PD 140W and
                    DisplayPort™ 1.4 1x HDMI® 2.1, up to 8K/60Hz 1x Headphone / microphone combo jack (3.5mm) 1x
                    Ethernet (RJ-45) 1x Power connector
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Card đồ họa</TableCell>
                  <TableCell>NVIDIA® GeForce RTX™ 3050 6GB GDDR6, Boost Clock 1732MHz, TGP 95W</TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {!!product?.description.trim() && (
              <div
                ref={descriptionRef}
                className={cn('mt-5 relative', {
                  'max-h-[500px] overflow-y-hidden': !isViewingMore
                })}
              >
                <h3 className='text-xl font-medium tracking-tight mb-5'>Đánh giá chi tiết {product?.name}</h3>
                <div
                  className='editor'
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(product?.description || '')
                  }}
                />
                <div
                  className={cn('inset-x-0 bottom-0 flex justify-center py-5 bg-white', {
                    'absolute before:absolute before:bottom-full before:inset-x-0 before:h-[200%] before:bg-gradient-to-b before:from-white/0 before:via-white/40 before:via-5% before:to-white':
                      !isViewingMore,
                    relative: isViewingMore
                  })}
                >
                  <Button
                    variant='link'
                    className='text-blue-600'
                    onClick={() => {
                      const newIsViewingMore = !isViewingMore
                      setIsViewingMore(newIsViewingMore)
                      !newIsViewingMore && descriptionRef.current?.scrollIntoView()
                    }}
                  >
                    {!isViewingMore ? 'Đọc tiếp bài viết' : 'Thu gọn bài viết'}{' '}
                    <ChevronDown
                      size={16}
                      className={cn('ml-2', {
                        'rotate-180': isViewingMore
                      })}
                    />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        {/* OTHER PRODUCTS + POSTS */}
        <div className='w-1/3'>
          <div className='grid gap-5'>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Sản phẩm tương tự</CardTitle>
              </CardHeader>
              <CardContent className='space-y-6'>
                {!getPublicProductsQuery.isLoading &&
                  sameProducts
                    .filter((product) => product._id !== productId)
                    .map((product) => (
                      <div key={product._id} className='flex space-x-2.5'>
                        <Link href={PATH.PRODUCT_DETAIL({ name: product.name, id: product._id })}>
                          <Image
                            width={100}
                            height={100}
                            src={product.thumbnail.url}
                            alt=''
                            className='w-[90px] aspect-square rounded-lg object-cover'
                          />
                        </Link>
                        <div className='flex-1 space-y-1'>
                          <Link
                            href={PATH.PRODUCT_DETAIL({ name: product.name, id: product._id })}
                            className='line-clamp-2 text-sm font-semibold hover:underline'
                          >
                            {product.name}
                          </Link>
                          <div className='flex items-end space-x-2'>
                            <div>
                              {product.priceAfterDiscount < product.originalPrice && (
                                <div className='text-xs text-muted-foreground line-through'>
                                  {formatCurrency(product.originalPrice)}&#8363;
                                </div>
                              )}
                              <div className='text-sm text-main font-semibold'>
                                {formatCurrency(product.priceAfterDiscount)}&#8363;
                              </div>
                            </div>
                            {product.priceAfterDiscount < product.originalPrice && (
                              <Badge variant='outline' className='border-main text-main'>
                                -{rateSale(product.originalPrice, product.priceAfterDiscount)}%
                              </Badge>
                            )}
                          </div>
                          <div className='flex items-center space-x-2'>
                            <div className='flex items-center space-x-1 text-yellow-500'>
                              <span className='text-xs font-semibold'>{product.review.averageReview.toFixed(1)}</span>
                              <Star size={13} className='fill-yellow-500' />
                            </div>
                            <div className='text-xs text-muted-foreground'>({product.review.totalReview} đánh giá)</div>
                          </div>
                        </div>
                      </div>
                    ))}
                {getPublicProductsQuery.isLoading && (
                  <div className='flex justify-center'>
                    <Loader2 strokeWidth={1} size={40} className='stroke-main animate-spin' />
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl'>Tin tức về công nghệ</CardTitle>
              </CardHeader>
              <CardContent className='space-y-3'>
                {!getPublicPostsQuery.isLoading &&
                  posts.map((post) => (
                    <div key={post._id} className='flex space-x-2'>
                      <Link href={PATH.POST_DETAIL({ name: post.title, id: post._id })} className='flex-shrink-0'>
                        <Image
                          width={100}
                          height={100}
                          src={post.thumbnail.url}
                          alt=''
                          className='w-[90px] aspect-video object-cover rounded-md'
                        />
                      </Link>
                      <div>
                        <Link
                          href={PATH.POST_DETAIL({ name: post.title, id: post._id })}
                          className='line-clamp-2 text-sm font-medium hover:underline'
                        >
                          {post.title}
                        </Link>
                      </div>
                    </div>
                  ))}
                {getPublicPostsQuery.isLoading && (
                  <div className='flex justify-center'>
                    <Loader2 strokeWidth={1} size={40} className='stroke-main animate-spin' />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      {/* REVIEWS INFO */}
      <Card id='review'>
        <CardHeader>
          <CardTitle className='text-2xl'>Đánh giá & Nhận xét {product?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className='flex justify-center items-center space-x-10'>
            <div className='flex flex-col items-center space-y-2'>
              <div className='font-semibold text-4xl text-main'>
                {(product?.review.averageReview || 0).toFixed(1)}/5
              </div>
              <div>
                <span className='font-semibold'>{product?.review.totalReview || 0}</span> đánh giá & nhận xét
              </div>
            </div>
            <div className='space-y-3'>
              {Array(5)
                .fill(0)
                .map((_, index) => {
                  const starPoint = 5 - index
                  let totalReview = 0
                  let percent = 0
                  if (product) {
                    if (starPoint === 5) {
                      totalReview = product.review.totalFiveStar
                    } else if (starPoint === 4) {
                      totalReview = product.review.totalFourStar
                    } else if (starPoint === 3) {
                      totalReview = product.review.totalThreeStar
                    } else if (starPoint === 2) {
                      totalReview = product.review.totalTwoStar
                    } else {
                      totalReview = product.review.totalOneStar
                    }
                    percent = (100 / product.review.totalReview) * totalReview
                  }
                  return (
                    <div key={index} className='flex items-center space-x-3'>
                      <div className='flex items-center space-x-1'>
                        <span>{starPoint}</span>
                        <Star size={16} className='fill-yellow-400 stroke-transparent' />
                      </div>
                      <div className='w-[400px] h-3 bg-secondary rounded-full relative'>
                        <div
                          style={{
                            width: `${percent}%`
                          }}
                          className='absolute top-0 bottom-0 left-0 w-1/2 bg-green-600 rounded-full'
                        />
                      </div>
                      <div className='text-sm'>{totalReview} đánh giá</div>
                    </div>
                  )
                })}
            </div>
          </div>
          {/* REVIEWS */}
          <div className='w-2/3 mt-5'>
            {product &&
              reviews.map((review) => (
                <div key={review._id} className='border-t first:border-t-0'>
                  <ReviewItem reviewData={review} />
                </div>
              ))}
          </div>
        </CardContent>
        <CardFooter className='border-t pt-5'>
          {product && isAuthenticated && (
            <ReviewDialog
              product={product}
              triggerElement={
                <Button disabled={isReviewd} className='px-20 bg-blue-600 hover:bg-blue-700'>
                  <Sparkles size={16} className='mr-3' />
                  {!isReviewd ? 'Gửi đánh giá của bạn' : 'Bạn đã đánh giá sản phẩm này'}
                </Button>
              }
            />
          )}
          {!isAuthenticated && isClient && <div className='text-sm'>Đăng nhập để đánh giá sản phẩm.</div>}
        </CardFooter>
      </Card>
      {/* UPDATE REVIEW DIALOG */}
      {product && currentUpdatedReviewId && (
        <ReviewDialog
          isOpenDialog={!!currentUpdatedReviewId}
          product={product}
          reviewId={currentUpdatedReviewId}
          onOpenChange={(value) => {
            if (!value) {
              setCurrentUpdatedReviewId(null)
            }
          }}
        />
      )}
      {/* DELETE REVIEW ALERT DIALOG */}
      <AlertDialog
        open={!!currentDeletedReviewId}
        onOpenChange={(value) => {
          if (!value) {
            setCurrentDeletedReviewId(null)
          }
        }}
      >
        <AlertDialogContent className='max-w-sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa review này?</AlertDialogTitle>
            <AlertDialogDescription>Review sẽ bị xóa vĩnh viễn và không thể khôi phục.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteReview}>Tiếp tục</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ProductDetailContext.Provider>
  )
}
