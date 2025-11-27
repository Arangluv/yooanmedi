import Image, { StaticImageData } from 'next/image'
import MainIcon1 from '@public/main_icon_1.png'
import MainIcon2 from '@public/main_icon_2.png'
import MainIcon3 from '@public/main_icon_3.png'
import MainForm from './concept2/MainForm'
import MainBannerImage from '@public/main_banner.jpg'

export default function Concept2() {
  return (
    <div className="w-full flex justify-center">
      <div className="w-full h-[100vh] bg-neutral-50"></div>
      <section className="w-full max-w-6xl h-full flex-shrink-0 flex">
        <LeftContent />
        <RightContent />
      </section>
      <div className="w-full h-full bg-white"></div>
    </div>
  )
}

function LeftContent() {
  return (
    <div className="w-[60%] h-[100vh] bg-neutral-50 flex flex-col justify-center px-12">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <span className="text-[15px] text-brandWeek">의약외품 브랜드스토어</span>
        <h1 className="text-4xl font-bold text-brand">유안메디팜 온라인 주문 서비스</h1>
        <p className="text-foreground-700">300개 이상의 제품을 원클릭으로 주문해보세요</p>
      </div>
      {/* Content Image */}
      <div className="w-full aspect-square bg-neutral-200 h-[240px] mb-8 rounded-md overflow-hidden">
        <Image src={MainBannerImage} alt="main banner" className="w-full h-full object-cover" />
      </div>
      {/* Progress */}
      <div className="flex flex-col gap-4">
        <ProgressItem
          icon={MainIcon1}
          title="약품·주사 장바구니 담기"
          description="복잡한 절차 없이 목록에 있는 제품을 장바구니에 담기만 하세요"
        />
        <ProgressItem
          icon={MainIcon2}
          title="주문하기"
          description="장바구니에 담은 제품을 주문하는 즉시 처리가 시작됩니다"
        />
        <ProgressItem
          icon={MainIcon3}
          title="배송 완료"
          description="유안메디팜은 당일 주문, 당일 배송을 지원합니다"
        />
      </div>
    </div>
  )
}

function ProgressItem({
  icon,
  title,
  description,
}: {
  icon: StaticImageData
  title: string
  description: string
}) {
  return (
    <div className="flex gap-4 items-center p-4 rounded-md bg-white ">
      {/* 아이콘 */}
      <div className="w-12 h-12 flex items-center justify-center bg-neutral-100 rounded-full">
        <div className="w-8 h-8">
          <Image src={icon} alt="icon" className="w-full h-full object-contain" />
        </div>
      </div>
      {/* 컨텐츠 */}
      <div className="flex flex-col gap-2">
        <span className="text-lg font-bold">{title}</span>
        <p className="text-[15px] text-foreground-700">{description}</p>
      </div>
    </div>
  )
}

function RightContent() {
  return (
    <div className="w-[40%] h-full bg-white py-8 px-12 flex items-center justify-center ">
      <MainForm />
    </div>
  )
}
