import CreateProductForm from '@/app/(admin)/_components/create-product-form'

type AdminProductUpdatePageProps = {
  params: {
    id: string
  }
}

export default function AdminProductUpdatePage({ params }: AdminProductUpdatePageProps) {
  const { id } = params
  return <CreateProductForm productId={id} />
}
