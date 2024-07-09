import ProductDetail from '@/app/(admin)/admin/product/[id]/product-detail'

type AdminProductUpdatePageProps = {
  params: {
    id: string
  }
}

export default function AdminProductUpdatePage({ params }: AdminProductUpdatePageProps) {
  const { id } = params
  return <ProductDetail productId={id} />
}
