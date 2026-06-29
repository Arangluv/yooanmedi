import { GetBannerApiResponse } from '@/entities/banner';
import { FramerCarousel } from './framer-carousel';

// todo :: refactor
const CarouselBanner = ({ bannerResponse }: { bannerResponse: GetBannerApiResponse }) => {
  if (!bannerResponse.isSuccess) {
    return null;
  }

  const images = bannerResponse.data.items.map((bannerItem) => bannerItem.image);
  return (
    <div className="my-4 flex h-[360px] w-full items-center justify-center">
      <section className="h-full w-full max-w-7xl">
        <FramerCarousel images={images} />
      </section>
    </div>
  );
};

export default CarouselBanner;
