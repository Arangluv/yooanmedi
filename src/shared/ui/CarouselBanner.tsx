import { FramerCarousel } from '@/components/ui/framer-carousel';
import { getMainBanners } from '../api/get-main-banner';
import { bannerSchema } from '../model/banner-schema';

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
