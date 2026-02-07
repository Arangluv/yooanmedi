'use server';

import { getPayload } from '@/shared';

interface GetPointTransactionContextParams {
  userId: number;
  orderId: number;
}

/**
 * @description 적립금 히스토리 생성을 위한 컨텍스트를 생성하는 함수
 */
export const getPointTransactionContext = async ({
  userId,
  orderId,
}: GetPointTransactionContextParams) => {
  const payload = await getPayload();

  try {
    const user = await payload.findByID({
      collection: 'users',
      id: userId,
      select: {
        point: true,
      },
    });

    const order = await payload.findByID({
      collection: 'order',
      id: orderId,
      select: {
        orderNo: true,
      },
    });

    if (!user || !order) {
      throw new Error('유저 또는 주문 정보가 없습니다');
    }

    return {
      payload,
      user,
      order,
    };
  } catch (error) {
    console.log(error);
    throw new Error('적립금 컨텍스트를 가져오는데 실패했습니다');
  }
};
