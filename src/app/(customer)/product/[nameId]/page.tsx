import { Metadata, ResolvingMetadata } from 'next'

import ProductDetail from '@/app/(customer)/product/[nameId]/product-detail'
import { getIdFromNameId } from '@/lib/utils'

type ProductDetailPageProps = { params: { nameId: string } }

export async function generateMetadata(
  { params }: ProductDetailPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { nameId } = params
  const productId = getIdFromNameId(nameId)
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1/products/${productId}/for-read`).then(
    (res) => res.json()
  )
  const product = response.data.product
  const previousImages = (await parent).openGraph?.images || []
  return {
    title: product.name,
    openGraph: {
      images: [product.thumbnail.url, ...previousImages]
    }
  }
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { nameId } = params
  const productId = getIdFromNameId(nameId)
  return <ProductDetail productId={productId} />
}
