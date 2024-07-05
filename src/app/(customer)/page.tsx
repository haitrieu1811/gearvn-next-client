import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import HomeCarousel from '@/app/(customer)/_components/home-carousel'
import MegaMenu from '@/app/(customer)/_components/mega-menu'
import banner1 from '@/assets/images/banner1.webp'
import banner2 from '@/assets/images/banner2.webp'
import banner3 from '@/assets/images/banner3.webp'
import banner4 from '@/assets/images/banner4.webp'
import banner5 from '@/assets/images/banner5.webp'
import PostItem from '@/components/post-item'
import ProductItem from '@/components/product-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import PATH from '@/constants/path'
import { PostItem as PostItemType } from '@/types/posts.types'
import { ProductItem as ProductItemType } from '@/types/products.types'

export const metadata: Metadata = {
  title: 'Trang chủ - GEARVN',
  description: 'Trang chủ - GEARVN'
}

const banners = [banner1, banner2, banner3, banner4, banner5] as const

export default async function HomePage() {
  const getProductsResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1/products?limit=5`).then(
    (res) => res.json()
  )
  const products = getProductsResponse.data.products as ProductItemType[]

  const getPostsResponse = await fetch(`${process.env.NEXT_PUBLIC_SERVER_BASE_URL}/v1/posts?limit=4`).then((res) =>
    res.json()
  )
  const posts = getPostsResponse.data.posts as PostItemType[]

  return (
    <div className='pt-2.5 pb-5'>
      <div className='max-w-6xl mx-auto space-y-5'>
        {/* CAROUSELS AND BANNERS */}
        <div className='grid grid-cols-10 gap-2.5'>
          <div className='col-span-2'>
            <MegaMenu />
          </div>
          <div className='col-span-8'>
            <div className='grid grid-cols-12 gap-2.5'>
              <div className='col-span-8'>
                <HomeCarousel />
              </div>
              <div className='col-span-4 grid gap-2.5'>
                {banners.slice(0, 2).map((banner, index) => (
                  <Image key={index} width={400} height={400} src={banner} className='w-full rounded-md' alt='' />
                ))}
              </div>
            </div>
            <div className='grid grid-cols-12 gap-2.5'>
              {banners.slice(2, 6).map((banner, index) => (
                <div key={index} className='col-span-4'>
                  <Image width={400} height={400} src={banner} className='w-full rounded-md' alt='' />
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* PRODUCTS */}
        <Card>
          <CardHeader className='flex-row justify-between items-center space-y-0'>
            <CardTitle className='text-2xl'>Sản phẩm nổi bật</CardTitle>
            <Button asChild variant='link' className='p-0'>
              <Link href={PATH.PRODUCT}>Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-10 gap-2'>
              {products.map((product) => (
                <div key={product._id} className='col-span-2'>
                  <ProductItem key={product._id} productData={product} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* POSTS */}
        <Card>
          <CardHeader className='flex-row justify-between items-center space-y-0'>
            <CardTitle className='text-2xl'>Tin tức công nghệ</CardTitle>
            <Button asChild variant='link'>
              <Link href={PATH.POST}>Xem tất cả</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-12 gap-5'>
              {posts.map((post) => (
                <div key={post._id} className='col-span-3'>
                  <PostItem key={post._id} postData={post} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
