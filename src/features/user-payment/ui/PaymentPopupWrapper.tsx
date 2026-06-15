'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { USER_PAYMENT_CONSTANTS } from '../constants';

interface PaymentSuccessMessageEventData {
  status: typeof USER_PAYMENT_CONSTANTS.status.success;
  amount: string;
  approvalDate: string;
  shopOrderNo: string;
}

interface PaymentFailMessageEventData {
  status: typeof USER_PAYMENT_CONSTANTS.status.fail;
  message: string;
}

type PaymentMessageEventData = PaymentSuccessMessageEventData | PaymentFailMessageEventData;

export const PaymentPopupWrapper = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  // TODO :: refactoring
  useEffect(() => {
    const popupHandler = (event: MessageEvent<PaymentMessageEventData>) => {
      const data = event.data;

      if (!data || typeof data !== 'object') {
        return;
      }

      if (!('status' in data)) {
        return;
      }

      if (data.status === USER_PAYMENT_CONSTANTS.status.success) {
        if (!('amount' in data) || !('approvalDate' in data) || !('shopOrderNo' in data)) {
          return;
        }

        router.push(
          '/order/payments/result?status=success&amount=' +
            String(data.amount) +
            '&approvalDate=' +
            encodeURIComponent(data.approvalDate) +
            '&shopOrderNo=' +
            encodeURIComponent(data.shopOrderNo),
        );
        return;
      }

      if (data.status === USER_PAYMENT_CONSTANTS.status.fail) {
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
