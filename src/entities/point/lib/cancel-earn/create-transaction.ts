'use server';

import { getPointTransactionContext } from '../get-point-transaction-context';
import { POINT_ACTION_TYPE } from '../../constants/point-action-type';
import { normalizePoint } from '../helper';
import { validateCancelEarnPoint } from './validate';

interface CreateCancelEarnPointTransactionParams {
  userId: number;
  orderId: number;
}

/**
 * @description 주문 시 적립된 적립금을 취소처리하는 함수
 * @param userId - 유저 ID
 * @param orderId - 주문 ID
 */
export const createCancelEarnPointTransaction = async ({
  userId,
  orderId,
}: CreateCancelEarnPointTransactionParams) => {
  try {
    const { payload, user, order } = await getPointTransactionContext({
      userId,
      orderId,
    });

    const { docs: previousPointTransaction } = await payload.find({
      collection: 'point-transactions',
      select: {
        amount: true,
      },
      where: {
        user: {
          equals: user.id,
        },
        order: {
          equals: order.id,
        },
        type: {
          equals: POINT_ACTION_TYPE.EARN,
        },
      },
      limit: 1,
    });

    validateCancelEarnPoint(previousPointTransaction);

    const { amount: previousPointTransactionAmount } = previousPointTransaction[0];

    await payload.create({
      collection: 'point-transactions',
      data: {
        user: userId,
        order: orderId,
        type: POINT_ACTION_TYPE.CANCEL_EARN,
        reason: `주문취소로 인한 적립금 취소 - 주문번호 : ${order.orderNo}`,
        amount: previousPointTransactionAmount,
      },
    });

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        point: normalizePoint(user.point) - previousPointTransactionAmount,
      },
    });
  } catch (error) {
    // todo :: error 핸들링
    throw new Error('적립금 취소 거래 내역을 생성하는데 실패했습니다');
  }
};
