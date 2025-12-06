import Image from 'next/image'
import { Tooltip } from '@heroui/react'
import { ShoppingCart } from 'lucide-react'
import { ProductItemType } from '@order/_type'
import { ProductInfoContext } from '@order/_context/order_context'
import { formatNumberWithCommas, getPointOnPurchase } from '@order/utils'
import { useContext } from 'react'

export default function ProductItem({ productItem }: { productItem: ProductItemType }) {
  const { setClickedProduct } = useContext(ProductInfoContext)

  return (
    <div className="w-full flex flex-col">
      {/* 상품 이미지 :: todo -> 클릭 시 장바구니 이동 */}
      <div
        className="flex flex-col group cursor-pointer"
        onClick={() => setClickedProduct(productItem)}
      >
        <div className="w-full aspect-square bg-neutral-50 rounded-lg overflow-hidden mb-4 border-1 border-foreground-200 relative">
          <Image
            src={productItem?.image?.url}
            alt={productItem?.image?.alt ? productItem.image.alt : ''}
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
        <span className="text-xs text-foreground-600">{productItem.manufacturer}</span>
        <span>{productItem.name}</span>
        <span className="text-sm text-foreground-600 mb-2">{productItem.specification}</span>
        <span className="text-lg font-bold flex gap-[1px] items-end">
          <span>{formatNumberWithCommas(productItem.price)}</span>
          <span className="font-normal">원</span>
        </span>
        {productItem.cashback_rate > 0 && (
          <span className="text-sm text-brandWeek">
            구매 시 적립금 {getPointOnPurchase(productItem.price, productItem.cashback_rate)}원
          </span>
        )}
      </div>
    </div>
  )
}
