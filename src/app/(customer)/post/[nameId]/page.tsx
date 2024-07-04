import { Metadata, ResolvingMetadata } from 'next'

import PostDetail from '@/app/(customer)/post/[nameId]/post-detail'
import { getIdFromNameId } from '@/lib/utils'

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

export default function PostDetailPage({ params }: PostDetailProps) {
  const { nameId } = params
  const postId = getIdFromNameId(nameId)
  return <PostDetail postId={postId} />
}
