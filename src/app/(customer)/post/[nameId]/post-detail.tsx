'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import React from 'react'

import postsApis from '@/apis/posts.apis'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import PATH from '@/constants/path'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Clock } from 'lucide-react'
import { convertMomentToVietnamese } from '@/lib/utils'
import moment from 'moment'
import PostItem from '@/components/post-item'
import usePosts from '@/hooks/usePosts'

type PostDetailProps = {
  postId: string
}

export default function PostDetail({ postId }: PostDetailProps) {
  const getPostForReadQuery = useQuery({
    queryKey: ['getPostForRead', postId],
    queryFn: () => postsApis.getPostForRead(postId)
  })

  const post = React.useMemo(() => getPostForReadQuery.data?.data.data.post, [getPostForReadQuery.data?.data.data.post])

  const { posts: otherPosts } = usePosts({ limit: '4' })

  return (
    <div className='py-5'>
      <div className='max-w-6xl mx-auto grid gap-5'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={PATH.HOME}>Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={PATH.POST}>Tin công nghệ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{post?.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <Card>
          <CardHeader className='items-center'>
            <CardTitle className='text-2xl text-center'>{post?.title}</CardTitle>
            <CardDescription className='flex items-center space-x-3'>
              <span className='flex items-center'>
                <Clock size={16} className='mr-2' />
                {convertMomentToVietnamese(moment(post?.createdAt).fromNow())}
              </span>
              <span className='w-1 h-1 rounded-full bg-muted-foreground' />
              <span className='text-blue-600 font-medium'>{post?.author.fullName}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>{post?.content}</CardContent>
          <CardFooter>
            <div className='space-y-5'>
              <h3 className='font-semibold tracking-tight text-xl'>Bài viết liên quan</h3>
              <div className='grid grid-cols-12 gap-5'>
                {otherPosts
                  .filter((post) => post._id !== postId)
                  .map((post) => (
                    <div key={post._id} className='col-span-3'>
                      <PostItem postData={post} />
                    </div>
                  ))}
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
