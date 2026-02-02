import Image from 'next/image';
import { Tooltip } from '@heroui/react';
import { ImageIcon, ShoppingCart } from 'lucide-react';
import { ProductItemType } from '@/app/(frontend)/(page)/order/_type';
import {
  InventoryContext,
  ProductInfoContext,
} from '@/app/(frontend)/(page)/order/_context/order_context';
import { formatNumberWithCommas, getMaxPointOnPurchase } from '@/app/(frontend)/(page)/order/utils';
import { useContext } from 'react';
import { toast } from 'sonner';
import { ExistingProductToast, AddedProductToast } from './ToastComponents';

export default function ProductItem({ productItem }: { productItem: ProductItemType }) {
  const { setClickedProduct } = useContext(ProductInfoContext);
  const { inventory, setInventory } = useContext(InventoryContext);

  const handleAddToInventory = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const isUserAdded = inventory.some((item) => item.product.id === productItem.id);
    if (isUserAdded) {
      // toast로 상품이 이미 담겨있습니다. 라고 알림
      toast.info(<ExistingProductToast />);
    } else {
      // 상품을 장바구니에 담기
      setInventory([...inventory, { product: productItem, quantity: 1 }]);
      toast.success(<AddedProductToast />);
    }
  };

  return (
    <div className="flex w-full flex-col">
      {/* 상품 이미지 :: todo -> 클릭 시 장바구니 이동 */}
      <div
        className="group flex cursor-pointer flex-col"
        onClick={() => setClickedProduct(productItem)}
      >
        <div className="border-foreground-200 relative mb-4 aspect-square w-full overflow-hidden rounded-lg border-1 bg-neutral-50">
          {productItem.image?.url ? (
            <Image
              src={productItem.image.url}
              alt={productItem.image.alt ?? ''}
              className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
              width={244}
              height={244}
              unoptimized={true}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center gap-1">
              <ImageIcon className="text-foreground-300 h-6 w-6" strokeWidth={1.5} />
              <span className="text-foreground-600 text-sm">상품 이미지를 준비중입니다.</span>
            </div>
          )}
          <button
            className="absolute right-2 bottom-2 flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100"
            style={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)' }}
            onClick={handleAddToInventory}
          >
            <Tooltip
              content="장바구니 담기"
              showArrow={true}
              classNames={{ content: 'text-brandWeek' }}
            >
              <ShoppingCart className="text-brand h-5 w-5" />
            </Tooltip>
          </button>
        </div>
        <span className="text-foreground-600 text-xs">{productItem.manufacturer}</span>
        <span>{productItem.name}</span>
        <span className="text-foreground-600 mb-2 text-sm">{productItem.specification}</span>
        <span className="flex items-end gap-[1px] text-lg font-bold">
          <span>{formatNumberWithCommas(productItem.price)}</span>
          <span className="font-normal">원</span>
        </span>
        {(productItem.cashback_rate > 0 || productItem.cashback_rate_for_bank > 0) && (
          <span className="text-brandWeek text-sm">
            구매 시 최대 적립금{' '}
            {getMaxPointOnPurchase({
              price: productItem.price,
              cashback_rate: productItem.cashback_rate,
              cashback_rate_for_bank: productItem.cashback_rate_for_bank,
            })}
            원
          </span>
        )}
      </div>
    </div>
  );
}
