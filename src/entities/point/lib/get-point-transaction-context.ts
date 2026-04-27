'use server';

import { UserRepository } from '@/entities/user/infrastructure';
import { getPayload } from '@/shared/infrastructure';

interface GetPointTransactionContextParams {
  userId: number;
  orderProductId: number;
}

/**
 * @description 적립금 히스토리 생성을 위한 컨텍스트를 생성하는 함수
 */
export const getPointTransactionContext = async ({
  userId,
  orderProductId,
}: GetPointTransactionContextParams) => {
  const payload = await getPayload();

  try {
    const user = await UserRepository.findById(userId);

    const orderProduct = await payload.findByID({
      collection: 'order-product',
      id: orderProductId,
      select: {},
    });

    if (!user || !orderProduct) {
      throw new Error('유저 또는 주문 정보가 없습니다');
    }

    return {
      payload,
      user,
      orderProduct,
    };
  } catch (error) {
    console.log(error);
    throw new Error('적립금 컨텍스트를 가져오는데 실패했습니다');
  }
};
