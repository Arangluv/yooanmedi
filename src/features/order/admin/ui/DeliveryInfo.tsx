'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/shadcn/card';
import { useOrderCollection } from '../model/order-provider';

const DeliveryInfo = () => {
  const { deliveryInfo } = useOrderCollection();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary text-xl">배송지 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-lg">
          <div className="flex items-center justify-between">
            <span>배송지</span>
            <span className="font-medium">{deliveryInfo?.address}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>배송 요청사항</span>
            <span className="font-medium">
              {deliveryInfo?.orderRequest ? deliveryInfo.orderRequest : '없음'}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeliveryInfo;
