'use client';

import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/shadcn/card';
import { useOrderDetail } from '@/features/order/order-detail';

const OrderUserInfo = ({ orderId }: { orderId: number }) => {
  const { user } = useOrderDetail(orderId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary text-xl">주문자 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-lg">
          <div className="flex items-center justify-between">
            <span>상호명</span>
            <span>{user.hospitalName}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>대표자명</span>
            <span>{user.ceo}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>전화번호</span>
            <span>{user.phoneNumber}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>이메일</span>
            <span>{user.contactEmail}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderUserInfo;
