'use server';

import { getPointTransactionContext } from '../get-point-transaction-context';
import { POINT_ACTION_TYPE } from '../../constants/point-action-type';
import { normalizePoint } from '../helper';
import { validateUsePoint } from './validate';

interface CreateUsePointTransactionParams {
  userId: number;
  orderId: number;
  amount: number;
}

/**
 * @description 주문 시 적립금 사용 히스토리를 생성하는 함수
 */
export const createUsePointTransaction = async ({
  userId,
  orderId,
  amount,
}: CreateUsePointTransactionParams) => {
  try {
    const { payload, user, order } = await getPointTransactionContext({
      userId,
      orderId,
    });

    validateUsePoint({ user, amount });

    await payload.create({
      collection: 'point-transactions',
      data: {
        user: userId,
        order: orderId,
        type: POINT_ACTION_TYPE.USE,
        reason: `적립금 사용 - 주문 아이디 : ${order.id}`,
        amount: amount,
      },
    });

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        point: normalizePoint(user.point) - amount,
      },
    });
  } catch (error) {
    // todo :: error 핸들링
    console.log(error);
    throw new Error('적립금 사용내역을 생성하는데 실패했습니다');
  }
};
