import { FramerCarousel } from './framer-carousel';
import { getMainBanners } from '../server';
import { bannerSchema } from '../core';

const CarouselBanner = async () => {
  const banners = await getMainBanners();
  const items = bannerSchema.parse(banners);

  return (
    <div className="my-4 flex h-[360px] w-full items-center justify-center">
      <section className="h-full w-full max-w-7xl">
        <FramerCarousel items={items} />
      </section>
    </div>
  );
};

export default CarouselBanner;
