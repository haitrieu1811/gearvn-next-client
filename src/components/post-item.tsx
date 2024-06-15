import Image from 'next/image'
import Link from 'next/link'

import PATH from '@/constants/path'
import { PostItem as PostItemType } from '@/types/posts.types'

type PostItemProps = {
  postData: PostItemType
}

export default function PostItem({ postData }: PostItemProps) {
  const { thumbnail, title, _id } = postData
  const detailLink = PATH.POST_DETAIL({ name: title, id: _id })
  return (
    <div className='space-y-2'>
      <Link href={detailLink} title={title}>
        <Image
          width={300}
          height={300}
          src={thumbnail.url}
          alt={title}
          className='w-full aspect-video object-cover rounded-md'
        />
      </Link>
      <Link href={detailLink} title={title} className='font-medium text-sm line-clamp-2 hover:underline'>
        {title}
      </Link>
    </div>
  )
}
