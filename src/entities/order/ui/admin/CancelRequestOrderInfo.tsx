import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/shadcn/card';

import { ItemGroup, ItemSeparator } from '@/shared/ui/shadcn/item';
import { Button } from '@/shared/ui/shadcn/button';
import { ORDER_STATUS } from '../../constants/order-status';
import OrderStatusBadge from './badge';
import OrderProductItem from './OrderProductItem';
import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import OrderAlertDialogContent from './OrderAlertDialogContent';

const CancelRequestOrderInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>주문취소 요청</span>
          <OrderStatusBadge orderStatus={ORDER_STATUS.CANCEL_REQUEST} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          <OrderProductItem isCancelAction={false} />
          {/* 마지막에는 seperator 렌러딩 x */}
          <ItemSeparator />
        </ItemGroup>
      </CardContent>
      <CardFooter className="justify-end">
        <AlertDialogTrigger asChild>
          <Button className="text-lg font-normal" variant="destructive">
            주문취소 처리
          </Button>
        </AlertDialogTrigger>
      </CardFooter>
      <OrderAlertDialogContent />
    </Card>
  );
};

export default CancelRequestOrderInfo;
