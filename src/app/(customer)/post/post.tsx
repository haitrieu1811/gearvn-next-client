'use client'

import { useSearchParams } from 'next/navigation'

import Pagination from '@/components/pagination'
import PostItem from '@/components/post-item'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import usePosts from '@/hooks/usePosts'

export default function Post() {
  const searchParams = useSearchParams()
  const page = searchParams.get('page') || '1'
  const { posts, pagination } = usePosts({ page })
  return (
    <div className='py-5'>
      <div className='container'>
        <Card>
          <CardHeader className='flex-row justify-center'>
            <CardTitle className='text-2xl'>Tất cả bài viết</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-12 gap-5'>
              {posts.map((post) => (
                <div key={post._id} className='col-span-3'>
                  <PostItem postData={post} />
                </div>
              ))}
            </div>
            {pagination.totalPages > 1 && <Pagination pageSize={pagination.totalPages} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
