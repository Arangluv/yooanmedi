'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const PaymentsRouter = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const popupHandler = (event: MessageEvent) => {
      if (event.data.status === 'success') {
        const amount = event.data.amount;
        const approvalDate = event.data.approvalDate;
        const shopOrderNo = event.data.shopOrderNo;

        router.push(
          '/order/payments/finish?status=success&amount=' +
            amount +
            '&approvalDate=' +
            approvalDate +
            '&shopOrderNo=' +
            shopOrderNo,
        );
        router.refresh();
      } else if (event.data.status === 'error') {
        router.push('/order/payments/finish?status=error&message=' + event.data.message);
        router.refresh();
      } else {
        alert('결제 주문 등록 실패');
      }
    };

    window.addEventListener('message', popupHandler);

    return () => {
      window.removeEventListener('message', popupHandler);
    };
  }, []);

  return children;
};

export default PaymentsRouter;
