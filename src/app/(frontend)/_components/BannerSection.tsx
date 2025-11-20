'use client'

import { FramerCarousel } from '@/components/ui/framer-carousel'

export default function BannerSection() {
  return (
    <div className="w-full h-[360px] my-4 flex justify-center items-center">
      <section className="w-full h-full max-w-7xl">
        <FramerCarousel />
      </section>
    </div>
  )
}
