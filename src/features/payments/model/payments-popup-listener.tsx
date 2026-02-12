'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

type PopupSuccessEventData = {
  status: 'success';
  amount: number;
  approvalDate: string;
  shopOrderNo: string;
};

type PopupErrorEventData = {
  status: 'error';
  message: string;
};

const PaymentsPopupListener = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  useEffect(() => {
    const popupHandler = (event: MessageEvent<PopupSuccessEventData | PopupErrorEventData>) => {
      if (event.data.status === 'success') {
        const amount = event.data.amount;
        const approvalDate = event.data.approvalDate;
        const shopOrderNo = event.data.shopOrderNo;

        router.push(
          '/order/payments/result?status=success&amount=' +
            amount +
            '&approvalDate=' +
            approvalDate +
            '&shopOrderNo=' +
            shopOrderNo,
        );
      } else if (event.data.status === 'error') {
        router.push('/order/payments/result?status=error&message=' + event.data.message);
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

export default PaymentsPopupListener;
