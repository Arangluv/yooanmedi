import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui/shadcn/card';

import {
  ItemGroup,
  Item,
  ItemMedia,
  ItemContent,
  ItemActions,
  ItemSeparator,
  ItemTitle,
  ItemDescription,
} from '@/shared/ui/shadcn/item';
import { Button } from '@/shared/ui/shadcn/button';
import { PackageX } from 'lucide-react';
import { ORDER_STATUS } from '../../constants/order-status';
import OrderStatusBadge from './badge';
import Image from 'next/image';
import TestImage from '@public/order/order_test.webp';
import OrderProductItem from './OrderProductItem';

const CancelOrderInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>취소된 주문</span>
          <OrderStatusBadge orderStatus={ORDER_STATUS.CANCELLED} />
        </CardTitle>
        <CardDescription className="flex flex-row gap-2 text-lg">
          <span>#202602197256615</span>•<span>2026-02-19 10:00:00 생성</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <OrderProductItem isCancelAction={false} />
          {/* 마지막에는 seperator 렌러딩 x */}
          <ItemSeparator />
        </ItemGroup>
      </CardContent>
    </Card>
  );
};

export default CancelOrderInfo;
