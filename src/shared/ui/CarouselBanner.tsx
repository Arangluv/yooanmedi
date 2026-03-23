import { FramerCarousel } from '@/components/ui/framer-carousel';

const CarouselBanner = () => {
  return (
    <div className="my-4 flex h-[360px] w-full items-center justify-center">
      <section className="h-full w-full max-w-7xl">
        <FramerCarousel />
      </section>
    </div>
  );
};

export default CarouselBanner;
