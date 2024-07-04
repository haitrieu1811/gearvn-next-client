import { Metadata } from 'next'
import React from 'react'

import Post from '@/app/(customer)/post/post'

export const metadata: Metadata = {
  title: 'Tất cả bài viết - GEARVN',
  description: 'Tất cả bài viết - GEARVN'
}

export default function PostPage() {
  return <Post />
}
