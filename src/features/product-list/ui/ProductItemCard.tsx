'use client';

import { ImageIcon } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/entities/product';
import { getMaxPointOnPurchase } from '@/entities/point';
import { formatNumberWithCommas } from '@/shared/lib/fomatters';
import useProductDetailStore from '../model/useProductDetailStore';
import FavoriteButton from '@/features/favorites-product/ui/FavoriteButton';
import { AddToCartButton } from '@/entities/cart';

const ProductItemCard = ({ product }: { product: Product }) => {
  const { setClieckedProduct } = useProductDetailStore();

  return (
    <div className="flex w-full flex-col">
      <div
        className="group flex cursor-pointer flex-col"
        onClick={() => setClieckedProduct(product)}
      >
        <div className="border-foreground-200 relative mb-4 aspect-square w-full overflow-hidden rounded-lg border-1 bg-neutral-50">
          {product?.image ? (
            <Image
              src={product.image.url}
              alt={'상품 이미지'}
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
          <div className="absolute right-2 bottom-2 flex items-center justify-center gap-2">
            <AddToCartButton product={product} />
            <FavoriteButton product={product} />
          </div>
        </div>
        <span className="text-foreground-600 text-xs">{product.manufacturer}</span>
        <span>{product.name}</span>
        <span className="text-foreground-600 mb-2 text-sm">{product.specification}</span>
        <span className="flex items-end gap-[1px] text-lg font-bold">
          <span>{formatNumberWithCommas(product.price)}</span>
          <span className="font-normal">원</span>
        </span>
        {(product.cashback_rate > 0 || product.cashback_rate_for_bank > 0) && (
          <span className="text-brandWeek text-sm">
            구매 시 최대 적립금 {formatNumberWithCommas(getMaxPointOnPurchase(product))}원
          </span>
        )}
      </div>
    </div>
  );
};

export default ProductItemCard;
