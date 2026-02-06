'use server';

import { getPointTransactionContext } from '../get-point-transaction-context';
import { POINT_ACTION_TYPE } from '../../constants/point-action-type';
import { normalizePoint } from '../helper';

interface CreateEarnPointTransactionParams {
  userId: number;
  orderId: number;
  amount: number;
}

/**
 * @description 주문 시 적립금을 적립하는 함수
 */
export const createEarnPointTransaction = async ({
  userId,
  orderId,
  amount,
}: CreateEarnPointTransactionParams) => {
  try {
    const { payload, user, order } = await getPointTransactionContext({
      userId,
      orderId,
    });

    await payload.create({
      collection: 'point-transactions',
      data: {
        user: userId,
        order: orderId,
        type: POINT_ACTION_TYPE.EARN,
        reason: `주문 완료 적립 - 주문번호 : ${order.orderNo}`,
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
