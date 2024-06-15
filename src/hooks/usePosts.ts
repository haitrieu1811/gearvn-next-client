import { useQuery } from '@tanstack/react-query'
import React from 'react'

import postsApis from '@/apis/posts.apis'
import { PaginationReqQuery } from '@/types/utils.types'

export default function usePosts(query: PaginationReqQuery) {
  const getPublicPostsQuery = useQuery({
    queryKey: ['getPublicPosts', query],
    queryFn: () => postsApis.getPublicPosts(query)
  })

  const posts = React.useMemo(
    () => getPublicPostsQuery.data?.data.data.posts || [],
    [getPublicPostsQuery.data?.data.data.posts]
  )
  const totalPost = React.useMemo(
    () => getPublicPostsQuery.data?.data.data.pagination.totalRows || 0,
    [getPublicPostsQuery.data?.data.data.pagination.totalRows]
  )

  return { getPublicPostsQuery, posts, totalPost }
}
