import Image from 'next/image';
import { ImageIcon } from 'lucide-react';
import { Item, ItemMedia, ItemContent, ItemTitle, ItemDescription } from '@/shared/ui/shadcn/item';
import { formatNumberWithCommas } from '@/shared';
import { PartialCancelDialogIconTrigger } from './dialogs';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import { OrderDetailDto, OrderDetailOrderProductReference } from '@/features/order/order-detail';

interface OrderProductItemProps {
  order: OrderDetailDto;
  orderProduct: OrderDetailOrderProductReference;
  idx: number;
}

const OrderProductItem = ({ order, orderProduct, idx }: OrderProductItemProps) => {
  return (
    <Item variant={idx % 2 === 0 ? 'default' : 'muted'}>
      <ItemMedia variant="image">
        {orderProduct.product.image ? (
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
            {orderProduct.product.specification && (
              <div className="min-w-[80px]">
                <ItemTitle className="text-base">규격</ItemTitle>
                <ItemDescription className="text-base">
                  {orderProduct.product.specification}
                </ItemDescription>
              </div>
            )}
            <div className="min-w-[80px]">
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
      {orderProduct.orderProductStatus !== ORDER_PRODUCT_STATUS.cancelled && (
        <PartialCancelDialogIconTrigger order={order} orderProductId={orderProduct.id} />
      )}
    </Item>
  );
};

export default OrderProductItem;
