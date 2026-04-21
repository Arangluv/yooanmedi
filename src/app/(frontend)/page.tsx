import Image, { StaticImageData } from 'next/image';
import MainIcon1 from '@public/main_icon_1.png';
import MainIcon2 from '@public/main_icon_2.png';
import MainIcon3 from '@public/main_icon_3.png';
import BgImage from '@public/v1_logo_small.png';
import MainForm from './_components/MainForm';
import CarouselBanner from '@/shared/ui/CarouselBanner';

export default function HomePage() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex h-full w-full max-w-7xl items-center gap-8">
        {/* 왼쪽 컨텐츠 */}
        <div className="flex w-[75%] items-center">
          <LeftContent />
        </div>
        {/* 로그인 영역 */}
        <div className="flex h-full w-[35%] items-center pt-8">
          <div
            className="w-full rounded-lg p-8"
            style={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' }}
          >
            <MainForm />
          </div>
        </div>
      </div>
    </div>
  );
}

function LeftContent() {
  return (
    <div className="relative flex h-[80vh] w-full flex-col justify-center gap-8">
      {/* 제목 영역 */}
      <div className="relative flex flex-col gap-4">
        <div className="absolute -top-[200px] -left-[200px] h-[400px] w-[400px]">
          <Image src={BgImage} alt="background" className="h-full w-full object-cover opacity-10" />
        </div>
        <h1 className="flex flex-col gap-1 text-4xl">
          <span className="text-brand text-2xl">병의원 필수제품을 판매하는</span>
          <span className="font-black">유안메디팜 온라인 주문 서비스</span>
        </h1>
        <p className="text-foreground-600 text-lg">
          유안메디팜은 병의원에 필수제품을 판매하는 온라인 쇼핑몰입니다.
        </p>
        <div className="flex justify-end">
          <span className="text-lg font-bold">오픈 이벤트 3개월간 배송비 무료</span>
        </div>
      </div>
      {/* 중단 이미지 */}
      {/* <div className="h-[360px] w-full overflow-hidden rounded-md">
        <Image src={MainBannerImage} alt="main banner" className="h-full w-full object-contain" />
      </div> */}
      <CarouselBanner />
      {/* 하단 프로그레스*/}
      <div className="flex w-full gap-8">
        <ProgressItem
          index={1}
          title="약품·주사 장바구니 담기"
          description="국내 최다 전문의약품 취급"
          icon={MainIcon1}
        />
        <ProgressItem
          index={2}
          title="주문하기"
          description="원클릭으로 바로주문"
          icon={MainIcon2}
        />
        <ProgressItem
          index={3}
          title="배송 완료"
          description="당일 주문, 당일 배송"
          icon={MainIcon3}
        />
      </div>
    </div>
  );
}

function ProgressItem({
  index,
  title,
  description,
  icon,
}: {
  index: number;
  title: string;
  description: string;
  icon: StaticImageData;
}) {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="flex items-center gap-2">
        <span className="text-brandWeek flex-shrink-0 text-2xl font-medium">
          {index.toString().padStart(2, '0')}
        </span>
        <div className="h-[1px] w-full bg-neutral-200"></div>
      </div>
      <div className="flex items-center gap-6">
        <div className="h-14 w-14">
          <Image src={icon} alt={title} className="h-full w-full object-contain" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg leading-none font-bold">{title}</span>
          <p className="text-foreground-700 text-[15px]">{description}</p>
        </div>
      </div>
    </div>
  );
}
