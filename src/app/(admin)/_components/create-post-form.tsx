'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQuery } from '@tanstack/react-query'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { ChevronLeft, Loader2, Upload } from 'lucide-react'
import moment from 'moment'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import postsApis from '@/apis/posts.apis'
import { approvalStatuses } from '@/app/(admin)/_columns/posts.columns'
import Editor from '@/components/editor'
import InputFile from '@/components/input-file'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { PostStatus } from '@/constants/enum'
import useUploadImage from '@/hooks/useUploadImage'
import { convertMomentToVietnamese, handleErrorsFromServer, htmlToMarkdown } from '@/lib/utils'
import { CreatePostSchema, createPostSchema } from '@/rules/posts.rules'

type CreatePostFormProps = {
  postId?: string
}

export default function CreatePostForm({ postId }: CreatePostFormProps) {
  const router = useRouter()

  const isUpdateMode = !!postId

  const [thumbnailFile, setThumbnailFile] = React.useState<File | null>(null)
  const [markdownContent, setMarkdownContent] = React.useState<string>('')

  const previewThumbnail = React.useMemo(
    () => (thumbnailFile ? URL.createObjectURL(thumbnailFile) : null),
    [thumbnailFile]
  )

  const handleChangeThumbnail = (files: File[] | undefined) => {
    if (!files) return
    setThumbnailFile(files[0])
  }

  const form = useForm<CreatePostSchema>({
    resolver: zodResolver(createPostSchema),
    defaultValues: {
      title: '',
      description: '',
      orderNumber: '',
      status: '',
      content: ''
    }
  })

  const { uploadImageMutation } = useUploadImage()

  const getPostForUpdateQuery = useQuery({
    queryKey: ['getPostForUpdate', postId],
    queryFn: () => postsApis.getPostForUpdate(postId as string),
    enabled: !!postId
  })

  const post = React.useMemo(
    () => getPostForUpdateQuery.data?.data.data.post,
    [getPostForUpdateQuery.data?.data.data.post]
  )

  const handleFillDataIntoTheForm = React.useCallback(() => {
    if (!post) return
    const { title, description, content, status, orderNumber } = post
    const { setValue } = form
    setValue('title', title)
    setValue('description', description)
    setValue('status', status.toString())
    setValue('orderNumber', orderNumber.toString())
    setMarkdownContent(htmlToMarkdown(content))
  }, [form, post])

  // FILL DATA INTO THE FORM (UPDATE MODE)
  React.useEffect(() => {
    handleFillDataIntoTheForm()
  }, [handleFillDataIntoTheForm])

  const createPostMutation = useMutation({
    mutationKey: ['createPost'],
    mutationFn: postsApis.createPost,
    onSuccess: (data) => {
      toast.success(data.data.message)
      form.reset()
      setThumbnailFile(null)
    },
    onError: (errors) => {
      handleErrorsFromServer({ errors, form })
    }
  })

  const updatePostMutation = useMutation({
    mutationKey: ['updatePost'],
    mutationFn: postsApis.updatePost,
    onSuccess: (data) => {
      toast.success(data.data.message)
      setThumbnailFile(null)
      getPostForUpdateQuery.refetch()
    },
    onError: (errors) => {
      handleErrorsFromServer({ errors, form })
    }
  })

  const isFormPending = uploadImageMutation.isPending || createPostMutation.isPending || updatePostMutation.isPending

  const handleCancel = () => {
    setThumbnailFile(null)
    form.clearErrors()
    if (!isUpdateMode) {
      form.reset()
      return
    }
    handleFillDataIntoTheForm()
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!isUpdateMode && !thumbnailFile) return
    if (!form.getValues('content').trim()) return
    let thumbnailId = post?.thumbnail._id
    if (thumbnailFile) {
      const form = new FormData()
      form.append('image', thumbnailFile)
      const res = await uploadImageMutation.mutateAsync(form)
      thumbnailId = res.data.data.images[0]._id
    }
    if (!isUpdateMode) {
      if (!thumbnailId) return
      createPostMutation.mutate({
        ...data,
        status: Number(data.status),
        orderNumber: Number(data.orderNumber),
        thumbnail: thumbnailId,
        content: form.getValues('content')
      })
      return
    }
    const { title, description, orderNumber, status } = data
    const body = omitBy(
      {
        title: title !== post?.title ? title : undefined,
        description: description !== post?.description ? description : undefined,
        content: form.getValues('content') !== post?.content ? form.getValues('content') : undefined,
        orderNumber: Number(orderNumber) !== post?.orderNumber ? Number(orderNumber) : undefined,
        status: Number(status) !== post?.status ? Number(status) : undefined,
        thumbnail: thumbnailId !== post?.thumbnail._id ? thumbnailId : undefined
      },
      isUndefined
    )
    updatePostMutation.mutate({ body, postId })
  })

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit}>
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-3'>
            <Button type='button' size='icon' variant='outline' className='w-8 h-8' onClick={() => router.back()}>
              <ChevronLeft size={16} />
            </Button>
            <div className='flex items-center space-x-3'>
              <h1 className='text-xl tracking-tight font-semibold'>{!post ? 'Tạo bài viết mới' : post.title}</h1>
              {post && approvalStatuses[post.approvalStatus]}
            </div>
          </div>
          <div className='flex justify-center space-x-2'>
            <Button variant='outline' type='button' size='sm' className='capitalize' onClick={handleCancel}>
              Hủy bỏ
            </Button>
            <Button type='submit' size='sm' disabled={isFormPending} className='capitalize'>
              {isFormPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              {!isUpdateMode ? 'Tạo bài viết' : 'Cập nhật bài viết'}
            </Button>
          </div>
        </div>
        <div className='grid grid-cols-12 gap-5 mt-5'>
          <div className='col-span-9 grid gap-5'>
            <Card>
              <CardHeader>
                <CardTitle>Thông tin bài viết</CardTitle>
              </CardHeader>
              <CardContent className='space-y-8'>
                {/* TITLE */}
                <FormField
                  control={form.control}
                  name='title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề bài viết</FormLabel>
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
                      <FormLabel>Thứ tự sắp xếp bài viết</FormLabel>
                      <FormControl>
                        <Input type='text' {...field} />
                      </FormControl>
                      <FormDescription>
                        Thứ tự sắp xếp càng nhỏ thì bài viết càng được ưu tiên đưa lên đầu.
                      </FormDescription>
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
                      <FormLabel>Mô tả bài viết</FormLabel>
                      <FormControl>
                        <Textarea rows={5} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* CONTENT */}
                <div className='space-y-2'>
                  <Editor
                    value={markdownContent}
                    onChange={({ html, text }) => {
                      form.setValue('content', html)
                      !!text && setMarkdownContent(text)
                    }}
                  />
                  {form.formState.isSubmitted && !form.getValues('content').trim() && (
                    <p className='text-[0.8rem] font-medium text-destructive'>Vui lòng nhập nội dung bài viết</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className='col-span-3'>
            <div className='grid gap-5'>
              {/* THUMBNAIL */}
              <Card>
                <CardHeader>
                  <CardTitle>Hình đại diện bài viết</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='space-y-2'>
                    {/* THUMNAIL NOT UPLOAD */}
                    {!thumbnailFile && !post?.thumbnail && (
                      <InputFile onChange={(files) => handleChangeThumbnail(files)}>
                        <div className='aspect-square bg-muted rounded-lg flex justify-center items-center hover:cursor-pointer'>
                          <Upload size={40} strokeWidth={1.5} />
                        </div>
                      </InputFile>
                    )}
                    {/* AVAILABLE THUMBNAIL */}
                    {(!!previewThumbnail || post?.thumbnail) && (
                      <div className='relative'>
                        <Image
                          width={200}
                          height={200}
                          src={previewThumbnail || post?.thumbnail.url || ''}
                          alt={post?.title || ''}
                          className='aspect-square w-full object-cover rounded-lg'
                        />
                        <div className='absolute inset-x-0 bottom-0 p-2 rounded-b-lg bg-muted-foreground/50 flex justify-end'>
                          <InputFile onChange={(files) => handleChangeThumbnail(files)}>
                            <Button type='button' size='sm'>
                              Đổi ảnh khác
                            </Button>
                          </InputFile>
                        </div>
                      </div>
                    )}
                    {/* THUMBNAIL ERROR MESSAGE */}
                    {!thumbnailFile && form.formState.isSubmitted && !isUpdateMode && (
                      <p className='text-xs text-destructive font-medium text-[0.8rem]'>
                        Ảnh đại diện bài viết là bắt buộc.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
              {/* STATUS */}
              <Card>
                <CardHeader>
                  <CardTitle>Trạng thái bài viết</CardTitle>
                </CardHeader>
                <CardContent className='space-y-8'>
                  {/* STATUS */}
                  <FormField
                    control={form.control}
                    name='status'
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Trạng thái hoạt động</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder='Chọn trạng thái hoạt động' />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {[
                              {
                                value: PostStatus.Active.toString(),
                                name: 'Đang hoạt động'
                              },
                              {
                                value: PostStatus.Inactive.toString(),
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
              {/* OTHER INFOS */}
              {post && (
                <Card>
                  <CardHeader>
                    <CardTitle>Thông tin khác</CardTitle>
                  </CardHeader>
                  <CardContent className='text-sm space-y-5'>
                    <div className='space-y-2'>
                      <div>Tạo lúc:</div>
                      <div>
                        {moment(post.createdAt).format('DD-MM-YYYY')} (
                        {convertMomentToVietnamese(moment(post.createdAt).fromNow())})
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div>Cập nhật lúc:</div>
                      <div>
                        {moment(post.updatedAt).format('DD-MM-YYYY')} (
                        {convertMomentToVietnamese(moment(post.updatedAt).fromNow())})
                      </div>
                    </div>
                    <div className='space-y-2'>
                      <div>Tác giả:</div>
                      <div className='flex items-center space-x-2'>
                        <Avatar>
                          <AvatarImage src={post.author.avatar} />
                          <AvatarFallback>
                            {post.author.fullName[0].toUpperCase()}
                            {post.author.fullName[1].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          {post.author.email} ({post.author.fullName})
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
  )
}
