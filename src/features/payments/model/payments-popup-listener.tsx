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

  // TODO :: 해당부분 반드시 리팩토링
  useEffect(() => {
    const popupHandler = (event: MessageEvent<unknown>) => {
      const data = event.data;

      if (!data || typeof data !== 'object') {
        return;
      }

      if (!('status' in data)) {
        return;
      }

      if (data.status === 'success') {
        if (!('amount' in data) || !('approvalDate' in data) || !('shopOrderNo' in data)) {
          return;
        }

        router.push(
          '/order/payments/result?status=success&amount=' +
            String(data.amount) +
            '&approvalDate=' +
            encodeURIComponent(String(data.approvalDate)) +
            '&shopOrderNo=' +
            encodeURIComponent(String(data.shopOrderNo)),
        );
        return;
      }

      if (data.status === 'error') {
        if (!('message' in data)) {
          return;
        }

        router.push(
          '/order/payments/result?status=error&message=' + encodeURIComponent(String(data.message)),
        );
      }
    };

    window.addEventListener('message', popupHandler);

    return () => {
      window.removeEventListener('message', popupHandler);
    };
  }, [router]);

  return children;
};

export default PaymentsPopupListener;
