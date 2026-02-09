'use server';

import { POINT_ACTION_TYPE } from '../../constants/point-action-type';
import { getPointTransactionContext } from '../get-point-transaction-context';
import { normalizePoint } from '../helper';
import { validateCancelUsePoint } from './validate';

interface CreateCancelUsePointTransactionParams {
  userId: number;
  orderProductId: number;
}

/**
 * @description 주문취소 시 사용된 적립금을 반환처리 하는 함수
 */
export const createCancelUsePointTransaction = async ({
  userId,
  orderProductId,
}: CreateCancelUsePointTransactionParams) => {
  try {
    const { payload, user, orderProduct } = await getPointTransactionContext({
      userId,
      orderProductId,
    });

    const { docs: previousPointTransaction } = await payload.find({
      collection: 'point-transaction',
      select: {
        amount: true,
      },
      where: {
        user: {
          equals: user.id,
        },
        orderProduct: {
          equals: orderProduct.id,
        },
        type: {
          equals: POINT_ACTION_TYPE.USE,
        },
      },
    });

    validateCancelUsePoint(previousPointTransaction);

    const { amount: previousPointTransactionAmount } = previousPointTransaction[0];

    await payload.create({
      collection: 'point-transaction',
      data: {
        user: user.id,
        orderProduct: orderProduct.id,
        type: POINT_ACTION_TYPE.CANCEL_USE,
        reason: `주문취소로 인한 적립금 사용 취소 - 주문 상품 아이디 : ${orderProduct.id}`,
        amount: previousPointTransactionAmount,
      },
    });

    await payload.update({
      collection: 'users',
      id: userId,
      data: {
        point: normalizePoint(user.point) + previousPointTransactionAmount,
      },
    });
  } catch (error) {
    // todo :: error 핸들링
    throw new Error('사용 적립금을 환불처리하는데 문제가 발생했습니다');
  }
};
