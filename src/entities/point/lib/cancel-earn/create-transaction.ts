'use server';

import { getPointTransactionContext } from '../get-point-transaction-context';
import { POINT_ACTION } from '../../constants/point-action';
import { normalizePoint } from '../helper';
import { validateCancelEarnPoint } from './validate';

interface CreateCancelEarnPointTransactionParams {
  userId: number;
  orderProductId: number;
}

/**
 * @description 주문 시 적립된 적립금을 취소처리하는 함수
 * @param userId - 유저 ID
 * @param orderId - 주문 ID
 */
export const createCancelEarnPointTransaction = async ({
  userId,
  orderProductId,
}: CreateCancelEarnPointTransactionParams) => {
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
          equals: POINT_ACTION.EARN,
        },
      },
      limit: 1,
    });

    validateCancelEarnPoint(previousPointTransaction);

    const { amount: previousPointTransactionAmount } = previousPointTransaction[0];

    await payload.create({
      collection: 'point-transaction',
      data: {
        user: userId,
        orderProduct: orderProduct.id,
        type: POINT_ACTION.CANCEL_EARN,
        reason: `주문취소로 인한 적립금 취소 - 주문 상품 아이디 : ${orderProduct.id}`,
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

    return previousPointTransactionAmount;
  } catch (error) {
    console.log('error');
    console.log(error);
    // todo :: error 핸들링
    throw new Error('적립금 취소 거래 내역을 생성하는데 실패했습니다');
  }
};
