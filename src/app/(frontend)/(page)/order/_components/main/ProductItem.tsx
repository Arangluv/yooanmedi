import Image from 'next/image'
import { Tooltip } from '@heroui/react'
import { ImageIcon, ShoppingCart } from 'lucide-react'
import { ProductItemType } from '@order/_type'
import { InventoryContext, ProductInfoContext } from '@order/_context/order_context'
import { formatNumberWithCommas, getPointOnPurchase } from '@order/utils'
import { useContext } from 'react'
import { toast } from 'sonner'
import { ExistingProductToast, AddedProductToast } from './ToastComponents'

export default function ProductItem({ productItem }: { productItem: ProductItemType }) {
  const { setClickedProduct } = useContext(ProductInfoContext)
  const { inventory, setInventory } = useContext(InventoryContext)

  const handleAddToInventory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const isUserAdded = inventory.some((item) => item.product.id === productItem.id)
    if (isUserAdded) {
      // toast로 상품이 이미 담겨있습니다. 라고 알림
      toast.info(<ExistingProductToast />)
    } else {
      // 상품을 장바구니에 담기
      setInventory([...inventory, { product: productItem, quantity: 1 }])
      toast.success(<AddedProductToast />)
    }
  }

  return (
    <div className="w-full flex flex-col">
      {/* 상품 이미지 :: todo -> 클릭 시 장바구니 이동 */}
      <div
        className="flex flex-col group cursor-pointer"
        onClick={() => setClickedProduct(productItem)}
      >
        <div className="w-full aspect-square bg-neutral-50 rounded-lg overflow-hidden mb-4 border-1 border-foreground-200 relative">
          {productItem.image?.url ? (
            <Image
              src={productItem.image.url}
              alt={productItem.image.alt ?? ''}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={244}
              height={244}
              unoptimized={true}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center gap-1">
              <ImageIcon className="w-6 h-6 text-foreground-300" strokeWidth={1.5} />
              <span className="text-sm text-foreground-600">상품 이미지를 준비중입니다.</span>
            </div>
          )}
          <button
            className="w-10 h-10 bg-neutral-100 absolute bottom-2 right-2 rounded-full flex items-center justify-center"
            style={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)' }}
            onClick={handleAddToInventory}
          >
            <Tooltip
              content="장바구니 담기"
              showArrow={true}
              classNames={{ content: 'text-brandWeek' }}
            >
              <ShoppingCart className="w-5 h-5 text-brand" />
            </Tooltip>
          </button>
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
