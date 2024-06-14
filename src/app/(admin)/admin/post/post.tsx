'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2, PlusCircle, StickyNote } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

import postsApis from '@/apis/posts.apis'
import { columns } from '@/app/(admin)/_columns/posts.columns'
import AnalyticsCard from '@/app/(admin)/_components/analytics-card'
import DataTable from '@/components/data-table'
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
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'

type AdminPostContext = {
  setCurrentDeletedPostId: React.Dispatch<React.SetStateAction<string | null>>
}

export const AdminPostContext = React.createContext<AdminPostContext>({
  setCurrentDeletedPostId: () => null
})

export default function AdminPost() {
  const [currentDeletedPostId, setCurrentDeletedPostId] = React.useState<string | null>(null)

  const getAllPostsQuery = useQuery({
    queryKey: ['getAllPosts'],
    queryFn: () => postsApis.getAllPosts()
  })

  const allPosts = React.useMemo(
    () => getAllPostsQuery.data?.data.data.posts || [],
    [getAllPostsQuery.data?.data.data.posts]
  )
  const totalPost = React.useMemo(
    () => getAllPostsQuery.data?.data.data.pagination.totalRows || 0,
    [getAllPostsQuery.data?.data.data.pagination.totalRows]
  )
  const analyticCards = React.useMemo(
    () => [
      {
        Icon: StickyNote,
        mainNumber: totalPost,
        strongText: 'Tổng cộng',
        slimText: 'bài viết trên hệ thống.'
      }
    ],
    [totalPost]
  )

  const deletePostMutation = useMutation({
    mutationKey: ['deletePost'],
    mutationFn: postsApis.deletePost,
    onSuccess: (data) => {
      toast.success(data.data.message)
      getAllPostsQuery.refetch()
      setCurrentDeletedPostId(null)
    }
  })

  const handleDeletePost = () => {
    if (!currentDeletedPostId) return
    deletePostMutation.mutate(currentDeletedPostId)
  }

  return (
    <React.Fragment>
      <div className='space-y-5'>
        {/* ANALYTIC CARDS */}
        <div className='grid grid-cols-12 gap-5'>
          {analyticCards.map((analyticCards, index) => (
            <div key={index} className='col-span-3'>
              <AnalyticsCard {...analyticCards} />
            </div>
          ))}
        </div>
        {/* BUTTONS GROUP */}
        <div className='flex justify-end space-x-2'>
          <Button size='sm' asChild>
            <Link href={PATH.ADMIN_POST_NEW}>
              <PlusCircle size={16} className='mr-2' />
              Thêm bài viết mới
            </Link>
          </Button>
        </div>
        {/* TABLE DATA */}
        <Card>
          <CardHeader>
            <CardTitle>Danh sách bài viết</CardTitle>
            <CardDescription>Có {totalPost} trên hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminPostContext.Provider
              value={{
                setCurrentDeletedPostId
              }}
            >
              <DataTable columns={columns} data={allPosts} searchField='title' />
            </AdminPostContext.Provider>
          </CardContent>
        </Card>
      </div>
      {/* DELETE POST ALERT DIALOG */}
      <AlertDialog
        open={!!currentDeletedPostId}
        onOpenChange={(value) => {
          if (!value) {
            !deletePostMutation.isPending && setCurrentDeletedPostId(null)
          }
        }}
      >
        <AlertDialogContent className='max-w-sm'>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa vĩnh viễn bài viết này?</AlertDialogTitle>
            <AlertDialogDescription>Bài viết sẽ không được khôi phục sau khi xóa.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletePostMutation.isPending}>Hủy bỏ</AlertDialogCancel>
            <AlertDialogAction disabled={deletePostMutation.isPending} onClick={handleDeletePost}>
              {deletePostMutation.isPending && <Loader2 className='w-4 h-4 mr-2 animate-spin' />}
              Tiếp tục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </React.Fragment>
  )
}
