import Image from 'next/image'
import TestImage from '@public/order/order_test.webp'
import { Tooltip } from '@heroui/react'
import { ShoppingCart } from 'lucide-react'

export default function ProductItem() {
  return (
    <div className="w-full flex flex-col">
      {/* 상품 이미지 :: todo -> 클릭 시 장바구니 이동 */}
      <div className="flex flex-col group cursor-pointer">
        <div className="w-full aspect-square bg-neutral-50 rounded-lg overflow-hidden mb-4 border-1 border-foreground-200 relative">
          <Image
            src={TestImage}
            alt="test"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            width={244}
            height={244}
            unoptimized={true}
          />
          <div
            className="w-10 h-10 bg-neutral-100 absolute bottom-2 right-2 rounded-full flex items-center justify-center"
            style={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)' }}
          >
            <Tooltip
              content="장바구니 담기"
              showArrow={true}
              classNames={{ content: 'text-brandWeek' }}
            >
              <ShoppingCart className="w-5 h-5 text-brand" />
            </Tooltip>
          </div>
        </div>
        <span>테타불린에스앤주PFS</span>
        <span className="text-sm text-foreground-600 mb-2">1ml / 1관</span>
        <span className="text-lg font-bold flex gap-[1px] items-end mb-1">
          <span>106,000</span>
          <span className="font-normal">원</span>
        </span>
        <span className="text-sm text-brandWeek">구매 시 적립금 1060원</span>
      </div>
    </div>
  )
}
