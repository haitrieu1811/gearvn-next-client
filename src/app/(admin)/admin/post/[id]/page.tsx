import CreatePostForm from '@/app/(admin)/_components/create-post-form'

export default function AdminPostUpdatePage({ params }: { params: { id: string } }) {
  const { id } = params
  return <CreatePostForm postId={id} />
}
