import Image, { StaticImageData } from 'next/image'
import MainIcon1 from '@public/main_icon_1.png'
import MainIcon2 from '@public/main_icon_2.png'
import MainIcon3 from '@public/main_icon_3.png'
import MainBannerImage from '@public/main_banner.png'
import BgImage from '@public/v1_logo_small.png'
import MainForm from './MainForm'

export default function Concept1() {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-7xl h-full flex gap-8 items-center">
        {/* 왼쪽 컨텐츠 */}
        <div className="w-[75%] flex items-center">
          <LeftContent />
        </div>
        {/* 로그인 영역 */}
        <div className="w-[35%] h-full flex items-center pt-8">
          <div
            className="w-full rounded-lg p-8"
            style={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.1)' }}
          >
            <MainForm />
          </div>
        </div>
      </div>
    </div>
  )
}

function LeftContent() {
  return (
    <div className="w-full flex flex-col gap-8 relative h-[80vh] justify-center">
      {/* 제목 영역 */}
      <div className="flex flex-col gap-4 relative">
        <div className="absolute w-[400px] h-[400px] -left-[200px] -top-[200px]">
          <Image src={BgImage} alt="background" className="w-full h-full object-cover opacity-10" />
        </div>
        <h1 className="flex flex-col gap-1 text-4xl">
          <span className="text-brand text-2xl">병의원 필수제품을 판매하는</span>
          <span className="font-black">유안메디팜 온라인 주문 서비스</span>
        </h1>
        <p className="text-lg text-foreground-600">
          유안메디팜은 병의원에 필수제품을 판매하는 온라인 쇼핑몰입니다
        </p>
      </div>
      {/* 중단 이미지 */}
      <div className="w-full h-[360px] rounded-md overflow-hidden">
        <Image src={MainBannerImage} alt="main banner" className="w-full h-full object-contain" />
      </div>
      {/* 하단 프로그레스*/}
      <div className="w-full flex gap-8">
        <ProgressItemV2
          index={1}
          title="약품·주사 장바구니 담기"
          description="국내 최다 전문의약품 취급"
          icon={MainIcon1}
        />
        <ProgressItemV2
          index={2}
          title="주문하기"
          description="원클릭으로 바로주문"
          icon={MainIcon2}
        />
        <ProgressItemV2
          index={3}
          title="배송 완료"
          description="당일 주문, 당일 배송"
          icon={MainIcon3}
        />
      </div>
    </div>
  )
}

function ProgressItemV2({
  index,
  title,
  description,
  icon,
}: {
  index: number
  title: string
  description: string
  icon: StaticImageData
}) {
  return (
    <div className="w-full h-full flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <span className="flex-shrink-0 text-brandWeek text-2xl font-medium">
          {index.toString().padStart(2, '0')}
        </span>
        <div className="w-full h-[1px] bg-neutral-200"></div>
      </div>
      <div className="flex gap-6 items-center">
        <div className="w-14 h-14">
          <Image src={icon} alt={title} className="w-full h-full object-contain" />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold leading-none">{title}</span>
          <p className="text-[15px] text-foreground-700">{description}</p>
        </div>
      </div>
    </div>
  )
}
