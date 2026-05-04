'use client';

import { PAYMENT_STATUS_NAME } from '@/entities/order/constants/payment-status';
import { PAYMENTS_METHOD_NAME } from '@/entities/order/constants/payments-method';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/shared/ui/shadcn/card';
import { formatNumberWithCommas } from '@/shared/lib/fomatters';

import { useOrderCollection } from '../model/order-provider';

const PaymentInfo = () => {
  const { paymentInfo } = useOrderCollection();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-secondary text-xl">결제 정보</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 text-lg">
          <div className="flex items-center justify-between">
            <span>결제 방법</span>
            {paymentInfo?.paymentMethod && (
              <span className="font-medium">{PAYMENTS_METHOD_NAME[paymentInfo.paymentMethod]}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>결제 상태</span>
            {paymentInfo?.paymentStatus && (
              <span className="font-medium">{PAYMENT_STATUS_NAME[paymentInfo.paymentStatus]}</span>
            )}
          </div>
          <div className="flex items-center justify-between">
            <span>사용 포인트</span>
            <span className="font-medium">
              {formatNumberWithCommas(paymentInfo?.usedPoint ?? 0)}원
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="border-t">
        <div className="flex w-full items-center justify-between text-lg">
          <span className="font-bold">총 결제 금액</span>
          <span className="font-bold">
            {formatNumberWithCommas(paymentInfo?.finalPrice ?? 0)}원
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentInfo;
