'use client'

import Autoplay from 'embla-carousel-autoplay'
import { Loader2 } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

import MegaMenu from '@/app/(customer)/_components/mega-menu'
import banner1 from '@/assets/images/banner1.webp'
import banner2 from '@/assets/images/banner2.webp'
import banner3 from '@/assets/images/banner3.webp'
import banner4 from '@/assets/images/banner4.webp'
import banner5 from '@/assets/images/banner5.webp'
import carousel1 from '@/assets/images/carousel1.webp'
import carousel2 from '@/assets/images/carousel2.jpg'
import carousel3 from '@/assets/images/carousel3.webp'
import carousel4 from '@/assets/images/carousel4.webp'
import carousel5 from '@/assets/images/carousel5.webp'
import PostItem from '@/components/post-item'
import ProductItem from '@/components/product-item'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'
import PATH from '@/constants/path'
import usePosts from '@/hooks/usePosts'
import useProducts from '@/hooks/useProducts'

const carousels = [carousel1, carousel2, carousel3, carousel4, carousel5] as const
const banners = [banner1, banner2, banner3, banner4, banner5] as const

export default function Home() {
  const { products, getPublicProductsQuery } = useProducts({})
  const { posts, getPublicPostsQuery } = usePosts({})

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
                <Carousel
                  opts={{
                    loop: true
                  }}
                  plugins={[
                    Autoplay({
                      delay: 5000
                    })
                  ]}
                >
                  <CarouselContent>
                    {carousels.map((carousel, index) => (
                      <CarouselItem key={index}>
                        <Image
                          width={500}
                          height={500}
                          src={carousel}
                          alt=''
                          className='w-full object-container rounded-md aspect-auto'
                        />
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious className='left-2' />
                  <CarouselNext className='right-2' />
                </Carousel>
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
            {getPublicProductsQuery.isLoading && (
              <div className='flex justify-center'>
                <Loader2 size={50} strokeWidth={1} className='animate-spin stroke-main' />
              </div>
            )}
          </CardContent>
        </Card>
        {/* POSTS */}
        <Card>
          <CardHeader>
            <CardTitle className='text-2xl'>Tin tức công nghệ</CardTitle>
          </CardHeader>
          <CardContent>
            <div className='grid grid-cols-12 gap-2'>
              {posts.map((post) => (
                <div key={post._id} className='col-span-3'>
                  <PostItem key={post._id} postData={post} />
                </div>
              ))}
            </div>
            {getPublicPostsQuery.isLoading && (
              <div className='flex justify-center'>
                <Loader2 size={50} strokeWidth={1} className='animate-spin stroke-main' />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
