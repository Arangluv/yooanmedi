'use server';

import { getPayload } from '@/shared';

// TODO ::현재 order-product의 cancel api에서 참조중이지만
// 같은 entity에서는 참조하면 안된다 -> 리팩토링 필요
export const getPaymentPgCno = async (orderId: number) => {
  try {
    const payload = await getPayload();
    const payment = await payload.find({
      collection: 'payment',
      select: {
        pgCno: true,
      },
      where: {
        order: {
          equals: orderId,
        },
      },
    });

    if (payment.docs.length === 0) {
      throw new Error('결제 내역을 찾을 수 없습니다');
    }

    return payment.docs[0].pgCno;
  } catch (error) {
    throw error;
  }
};
