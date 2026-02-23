import Image from 'next/image';
import { ImageIcon, PackageX } from 'lucide-react';

import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/shared/ui/shadcn/item';
import { Button } from '@/shared/ui/shadcn/button';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { CollectionViewOrderProduct } from '../lib/normalize';
import { isPayloadImageRenderable } from '@/shared/lib/validation';
import { formatNumberWithCommas } from '@/shared/lib/fomatters';

interface OrderProductItemProps {
  orderProduct: CollectionViewOrderProduct;
  idx: number;
  isCancelAction: boolean;
}

const OrderProductItem = ({ orderProduct, idx, isCancelAction }: OrderProductItemProps) => {
  return (
    <Item variant={idx % 2 === 0 ? 'default' : 'muted'}>
      <ItemMedia variant="image">
        {isPayloadImageRenderable(orderProduct.image) ? (
          <Image
            src={orderProduct.image.url}
            alt="주문 상품 이미지"
            width={100}
            height={100}
            unoptimized={true}
          />
        ) : (
          <ImageIcon className="text-muted-foreground h-6 w-6" strokeWidth={1.5} />
        )}
      </ItemMedia>
      <ItemContent>
        <div className="flex items-center gap-[80px]">
          <div className="min-w-[200px]">
            <ItemTitle className="text-base">{orderProduct.productNameSnapshot}</ItemTitle>
          </div>
          <div className="flex items-center gap-16">
            <div>
              <ItemTitle className="text-base">가격</ItemTitle>
              <ItemDescription className="text-base">
                {formatNumberWithCommas(orderProduct.priceSnapshot)}원
              </ItemDescription>
            </div>
            <div>
              <ItemTitle className="text-base">수량</ItemTitle>
              <ItemDescription className="text-base">
                {formatNumberWithCommas(orderProduct.quantity)}개
              </ItemDescription>
            </div>
            <div>
              <ItemTitle className="text-base">배송비</ItemTitle>
              <ItemDescription className="text-base">
                {formatNumberWithCommas(orderProduct.productDeliveryFee)}원
              </ItemDescription>
            </div>
            <div>
              <ItemTitle className="text-base">총 결제 금액</ItemTitle>
              <ItemDescription className="text-base">
                {formatNumberWithCommas(orderProduct.totalAmount)}원
              </ItemDescription>
            </div>
          </div>
        </div>
      </ItemContent>
      {isCancelAction && (
        <ItemActions>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <PackageX className="size-6" strokeWidth={1.5} />
            </Button>
          </AlertDialogTrigger>
        </ItemActions>
      )}
    </Item>
  );
};

export default OrderProductItem;
