import { useMutation, useQuery } from '@tanstack/react-query'
import { Ellipsis, Loader2, Star } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import reviewsApis from '@/apis/reviews.apis'
import { ProductDetailContext } from '@/app/(customer)/product/[nameId]/product-detail'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { UserType } from '@/constants/enum'
import { AppContext } from '@/providers/app.provider'
import { ReviewItem as ReviewItemType } from '@/types/reviews.types'

type ReviewItemProps = {
  reviewData: ReviewItemType
}

export default function ReviewItem({ reviewData }: ReviewItemProps) {
  const [isReplying, setIsReplying] = React.useState<boolean>(false)
  const [replyContent, setReplyContent] = React.useState<string>('')

  const getRepliesOfReviewQuery = useQuery({
    queryKey: ['getRepliesOfReview'],
    queryFn: () => reviewsApis.getRepliesOfReview({ reviewId: reviewData._id })
  })

  const replies = React.useMemo(
    () => getRepliesOfReviewQuery.data?.data.data.reviews || [],
    [getRepliesOfReviewQuery.data?.data.data.reviews]
  )

  const { loggedUser } = React.useContext(AppContext)
  const { setCurrentUpdatedReviewId, setCurrentDeletedReviewId } = React.useContext(ProductDetailContext)

  const handleStartReply = () => {
    setIsReplying(true)
  }

  const handleCancelReply = () => {
    setIsReplying(false)
    setReplyContent('')
  }

  const replyReviewMutation = useMutation({
    mutationKey: ['replyReview'],
    mutationFn: reviewsApis.replyReview,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getRepliesOfReviewQuery.refetch()
      handleCancelReply()
    }
  })

  const handleReplyReview = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    replyReviewMutation.mutate({
      body: { content: replyContent },
      reviewId: reviewData._id
    })
  }

  return (
    <div key={reviewData._id} className='space-y-3 py-5'>
      <div className='flex justify-between items-center'>
        <div className='flex items-center space-x-3 text-sm'>
          {/* AUTHOR */}
          <div className='flex items-center space-x-3'>
            <Avatar className='w-6 h-6'>
              <AvatarImage src={reviewData.author.avatar} />
              <AvatarFallback className='text-[10px]'>
                {reviewData.author.fullName[0].toUpperCase()}
                {reviewData.author.fullName[1].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className='font-semibold'>{reviewData.author.fullName}</div>
          </div>
          {/* CREATED AT */}
          <div className='text-muted-foreground'>{moment(reviewData.createdAt).format('DD-MM-YYYY')}</div>
        </div>
        {/* ACTIONS */}
        {((loggedUser && [UserType.Staff, UserType.Admin].includes(loggedUser.type)) ||
          loggedUser?._id === reviewData.author._id) && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size='icon' variant='ghost'>
                <Ellipsis size={16} strokeWidth={1.5} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {loggedUser?._id === reviewData.author._id && (
                <React.Fragment>
                  <DropdownMenuItem onClick={() => setCurrentUpdatedReviewId(reviewData._id)}>
                    Cập nhật
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentDeletedReviewId(reviewData._id)}>Xóa</DropdownMenuItem>
                </React.Fragment>
              )}
              {loggedUser && [UserType.Staff, UserType.Admin].includes(loggedUser.type) && (
                <DropdownMenuItem onClick={handleStartReply}>Phản hồi</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
      <div className='flex items-start space-x-10'>
        {/* STAR POINT */}
        <div className='flex items-center space-x-0.5 w-[100px]'>
          {reviewData.starPoint &&
            Array(reviewData.starPoint)
              .fill(0)
              .map((_, index) => <Star key={index} size={16} className='fill-yellow-400 stroke-transparent' />)}
        </div>
        <div className='flex-1 space-y-2.5'>
          {/* CONTENT */}
          <div className='text-sm'>{reviewData.content}</div>
          {/* PHOTOS */}
          {reviewData.photos.length > 0 && (
            <div className='grid grid-cols-10 gap-1'>
              {reviewData.photos.map((photo) => (
                <div key={photo._id} className='col-span-1 aspect-square'>
                  <Link href={photo.url} target='_blank'>
                    <Image
                      width={100}
                      height={100}
                      src={photo.url}
                      alt=''
                      className='w-full h-full object-cover rounded'
                    />
                  </Link>
                </div>
              ))}
            </div>
          )}
          {/* REPLY INPUT */}
          {isReplying && (
            <form className='space-y-2' onSubmit={handleReplyReview}>
              <Input
                autoFocus
                type='text'
                value={replyContent}
                placeholder='Nhập phản hồi'
                onChange={(e) => setReplyContent(e.target.value)}
              />
              <div className='flex justify-end space-x-2'>
                <Button size='sm' variant='outline' onClick={handleCancelReply}>
                  Hủy
                </Button>
                <Button disabled={replyReviewMutation.isPending} size='sm'>
                  {replyReviewMutation.isPending && <Loader2 size={14} className='mr-2 animate-spin' />}
                  Phản hồi
                </Button>
              </div>
            </form>
          )}
          {/* REPLIES */}
          <div className='mt-5 space-y-2'>
            {replies.map((reply) => (
              <div key={reply._id} className='bg-muted rounded-md p-4 space-y-1'>
                <div className='flex justify-between items-center'>
                  <div className='flex items-center space-x-3 text-sm'>
                    <div className='flex items-center space-x-3'>
                      <Avatar className='w-6 h-6'>
                        <AvatarImage src={reply.author.avatar} />
                        <AvatarFallback className='text-[10px]'>
                          {reply.author.fullName[0].toUpperCase()}
                          {reply.author.fullName[1].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='text-main font-semibold'>{reply.author.fullName}</div>
                    </div>
                    <div className='text-muted-foreground'>{moment(reply.createdAt).format('DD-MM-YYYY')}</div>
                  </div>
                  {loggedUser?._id === reply.author._id && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size='icon' variant='ghost'>
                          <Ellipsis size={16} strokeWidth={1.5} />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setCurrentDeletedReviewId(reply._id)}>Xóa</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
                <div className='text-sm'>{reply.content}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
