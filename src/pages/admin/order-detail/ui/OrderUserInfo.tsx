'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/shadcn/card';
import { useOrderCollection } from '../model/order-provider';

const OrderUserInfo = () => {
  const { orderUserInfo } = useOrderCollection();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary text-xl">주문자 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-lg">
          <div className="flex items-center justify-between">
            <span>상호명</span>
            <span>{orderUserInfo?.hospitalName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>대표자명</span>
            <span>{orderUserInfo?.ceo}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>전화번호</span>
            <span>{orderUserInfo?.phoneNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>이메일</span>
            <span>{orderUserInfo?.email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderUserInfo;
