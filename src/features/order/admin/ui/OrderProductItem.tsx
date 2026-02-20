import Image from 'next/image';
import { PackageX } from 'lucide-react';

import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
} from '@/shared/ui/shadcn/item';
import { Button } from '@/shared/ui/shadcn/button';
import TestImage from '@public/order/order_test.webp';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import { CollectionViewOrderProduct } from '../lib/normalize';

interface OrderProductItemProps {
  orderProduct: CollectionViewOrderProduct;
  idx: number;
  isCancelAction: boolean;
}

const OrderProductItem = ({ orderProduct, idx, isCancelAction }: OrderProductItemProps) => {
  return (
    <Item variant={idx % 2 === 0 ? 'default' : 'muted'}>
      <ItemMedia variant="image">
        <Image src={TestImage} alt="test" width={100} height={100} unoptimized={true} />
      </ItemMedia>
      <ItemContent>
        <div className="flex items-center gap-[80px]">
          <div>
            <ItemTitle className="text-base">
              [2등급][화진]일회용주사침 25G16mm(5/8inch) 100개
            </ItemTitle>
          </div>
          <div className="flex items-center gap-16">
            <div>
              <ItemTitle className="text-base">가격</ItemTitle>
              <ItemDescription className="text-base">10,000원</ItemDescription>
            </div>
            <div>
              <ItemTitle className="text-base">수량</ItemTitle>
              <ItemDescription className="text-base">10개</ItemDescription>
            </div>
            <div>
              <ItemTitle className="text-base">배송비</ItemTitle>
              <ItemDescription className="text-base">2,500원</ItemDescription>
            </div>
            <div>
              <ItemTitle className="text-base">총 결제 금액</ItemTitle>
              <ItemDescription className="text-base">12,500원</ItemDescription>
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
