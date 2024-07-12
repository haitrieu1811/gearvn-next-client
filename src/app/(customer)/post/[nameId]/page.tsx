import { Clock } from 'lucide-react'
import moment from 'moment'
import { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'

import PostItem from '@/components/post-item'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'
import { convertMomentToVietnamese, getIdFromNameId } from '@/lib/utils'
import { PostItem as PostItemType } from '@/types/posts.types'

type PostDetailProps = {
  params: { nameId: string }
}

export async function generateMetadata({ params }: PostDetailProps, parent: ResolvingMetadata): Promise<Metadata> {
  const { nameId } = params
  const postId = getIdFromNameId(nameId)
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1/posts/${postId}/for-read`).then((res) =>
    res.json()
  )
  const post = response.data.post
  const previousImages = (await parent).openGraph?.images || []
  return {
    title: post.title,
    openGraph: {
      images: [post.thumbnail.url, ...previousImages]
    }
  }
}

export default async function PostDetailPage({ params }: PostDetailProps) {
  const { nameId } = params
  const postId = getIdFromNameId(nameId)

  const getPostResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1/posts/${postId}/for-read`).then(
    (res) => res.json()
  )
  const post = getPostResponse.data.post as PostItemType

  const getOtherPostsResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1/posts`).then((res) =>
    res.json()
  )
  const otherPosts = getOtherPostsResponse.data.posts as PostItemType[]

  return (
    <div className='py-5'>
      <div className='container grid gap-5'>
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
            <CardTitle className='text-3xl text-center font-bold'>{post?.title}</CardTitle>
            <CardDescription className='flex items-center space-x-3'>
              <span className='flex items-center'>
                <Clock size={16} className='mr-2' />
                {convertMomentToVietnamese(moment(post?.createdAt).fromNow())}
              </span>
              <span className='w-1 h-1 rounded-full bg-muted-foreground' />
              <span className='text-blue-600 font-medium'>{post?.author.fullName}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className='editor text-justify'
              dangerouslySetInnerHTML={{
                __html: post?.content || ''
              }}
            />
          </CardContent>
          <CardFooter>
            <div className='space-y-5 pt-5'>
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
