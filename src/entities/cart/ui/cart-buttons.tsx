'use client';

import { Badge } from '@heroui/react';
import { ShoppingCart, CreditCard } from 'lucide-react';
import useCartModalStore from '../model/hooks/useCartModalStore';
import { TextWithIconAlignVertical, CardActionButton } from '@/shared';
import { Product } from '@/entities/product/@x/carts';
import useCart from '../model/hooks/useCart';
import { useCartQuery } from '../model/hooks/useCartQuery';

// TODO:: 해당 네이밍으로 작성하는건 매우 좋지않음 -> 기능완성 후 반드시 리팩토링
export const CartModalOpenTextButton = () => {
  const { onOpen } = useCartModalStore();
  return (
    <TextWithIconAlignVertical
      text="장바구니"
      icon={<ShoppingCart className="size-6" strokeWidth={1.5} />}
      onClick={() => onOpen()}
    />
  );
};

export const CartModalOpenBottomButton = () => {
  const {
    result: { data },
  } = useCartQuery();
  const { onOpen } = useCartModalStore();

  return (
    <div className="fixed right-8 bottom-6">
      <Badge content={data.items.length} color="danger" placement="top-right" size="lg">
        <button
          className="bg-brand hover:bg-brandWeek flex h-20 min-w-24 cursor-pointer items-center justify-center gap-2 rounded-md px-4 transition-colors duration-300"
          onClick={onOpen}
        >
          <CreditCard className="h-6 w-6 text-white" />
          <span className="text-lg font-bold text-white">결제하기</span>
        </button>
      </Badge>
    </div>
  );
};

export const AddToCartButton = ({ product }: { product: Product }) => {
  const { addToCart, isAddToCartPending } = useCart();

  return (
    <CardActionButton
      icon={<ShoppingCart className="h-4 w-4 text-white" strokeWidth={1.5} />}
      description="장바구니 담기"
      isLoading={isAddToCartPending}
      onClick={() =>
        addToCart({
          product: product.id,
          quantity: 1,
        })
      }
    />
  );
};
