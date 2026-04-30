'use server';

import { getPointTransactionContext } from '../get-point-transaction-context';
import { POINT_ACTION } from '../../constants/point-action';
import { normalizePoint } from '../helper';

interface CreateEarnPointTransactionParams {
  userId: number;
  orderProductId: number;
  amount: number;
}

/**
 * @description 주문 시 적립금을 적립하는 함수
 */
export const createEarnPointTransaction = async ({
  userId,
  orderProductId,
  amount,
}: CreateEarnPointTransactionParams) => {
  try {
    const { payload, user, orderProduct } = await getPointTransactionContext({
      userId,
      orderProductId,
    });

    await payload.create({
      collection: 'point-transaction',
      data: {
        user: user.id,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.EARN,
        reason: `주문 완료 적립 - 주문 상품 아이디 : ${orderProduct.id}`,
        amount: amount,
      },
    });

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        point: normalizePoint(user.point) + amount,
      },
    });
  } catch (error) {
    // todo :: error 핸들링
    throw new Error('적립금 거래 내역을 생성하는데 실패했습니다');
  }
};
