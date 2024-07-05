import { Metadata, ResolvingMetadata } from 'next'
import Link from 'next/link'

import ProductDetail from '@/app/(customer)/product/[nameId]/product-detail'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import PATH from '@/constants/path'
import { getIdFromNameId } from '@/lib/utils'
import { ProductItem } from '@/types/products.types'

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

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { nameId } = params
  const productId = getIdFromNameId(nameId)
  const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1/products/${productId}/for-read`).then(
    (res) => res.json()
  )
  const product = response.data.product as ProductItem

  return (
    <div className='py-5'>
      <div className='max-w-6xl mx-auto grid gap-5'>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={PATH.HOME}>Trang chủ</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={PATH.PRODUCT}>Tất cả sản phẩm</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product?.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        <ProductDetail productId={productId} />
      </div>
    </div>
  )
}
