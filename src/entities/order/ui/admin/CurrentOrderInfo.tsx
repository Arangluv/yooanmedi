import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui/shadcn/card';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';

import { ItemGroup, ItemSeparator } from '@/shared/ui/shadcn/item';
import { Button } from '@/shared/ui/shadcn/button';
import { ORDER_STATUS } from '../../constants/order-status';
import OrderStatusBadge from './badge';
import OrderProductItem from './OrderProductItem';

export const CurrentOrderInfo = () => {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>주문 정보</span>
          <OrderStatusBadge orderStatus={ORDER_STATUS.PREPARING} />
        </CardTitle>
        <CardDescription className="flex flex-row gap-2 text-lg">
          <span>#202602197256615</span>•<span>2026-02-19 10:00:00 생성</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <OrderProductItem isCancelAction={true} />
          <ItemSeparator />
        </ItemGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <AlertDialogTrigger asChild>
          <Button className="text-lg font-normal">배송 처리</Button>
        </AlertDialogTrigger>
      </CardFooter>
    </Card>
  );
};

export default CurrentOrderInfo;
