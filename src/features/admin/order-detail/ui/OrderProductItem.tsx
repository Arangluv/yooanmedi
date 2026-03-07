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
import { OrderProduct } from '../model/order-detail-schema';
import { isPayloadImageRenderable } from '@/shared/lib/validation';
import { formatNumberWithCommas } from '@/shared/lib/fomatters';

import { OrderAction } from '../model/order-action-dialog-provider';

interface OrderProductItemProps {
  orderProduct: OrderProduct;
  orderId: number;
  idx: number;
  isCancelAction: boolean;
}

const OrderProductItem = ({
  orderId,
  orderProduct,
  idx,
  isCancelAction,
}: OrderProductItemProps) => {
  return (
    <Item variant={idx % 2 === 0 ? 'default' : 'muted'}>
      <ItemMedia variant="image">
        {isPayloadImageRenderable(orderProduct.product.image) ? (
          <Image
            src={orderProduct.product.image.url}
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
        <OrderAction.CancelTrigger
          targetOrderIds={[orderId]}
          targetOrderProductId={orderProduct.id}
          currentStatus={orderProduct.orderProductStatus}
          display={{
            count: 1,
            viewType: 'order-detail',
          }}
        />
      )}
    </Item>
  );
};

export default OrderProductItem;
