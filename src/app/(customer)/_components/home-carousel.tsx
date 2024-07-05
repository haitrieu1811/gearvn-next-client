'use client'

import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'

import carousel1 from '@/assets/images/carousel1.webp'
import carousel2 from '@/assets/images/carousel2.jpg'
import carousel3 from '@/assets/images/carousel3.webp'
import carousel4 from '@/assets/images/carousel4.webp'
import carousel5 from '@/assets/images/carousel5.webp'
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'

const carousels = [carousel1, carousel2, carousel3, carousel4, carousel5] as const

export default function HomeCarousel() {
  return (
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
  )
}
