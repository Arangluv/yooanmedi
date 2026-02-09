'use server';

import { getPointTransactionContext } from '../get-point-transaction-context';
import { POINT_ACTION_TYPE } from '../../constants/point-action-type';
import { normalizePoint } from '../helper';
import { validateUsePoint } from './validate';

interface CreateUsePointTransactionParams {
  userId: number;
  orderProductId: number;
  amount: number;
}

/**
 * @description 주문 시 적립금 사용 히스토리를 생성하는 함수
 */
export const createUsePointTransaction = async ({
  userId,
  orderProductId,
  amount,
}: CreateUsePointTransactionParams) => {
  try {
    const { payload, user, orderProduct } = await getPointTransactionContext({
      userId,
      orderProductId,
    });

    validateUsePoint({ user, amount });

    await payload.create({
      collection: 'point-transaction',
      data: {
        user: user.id,
        orderProduct: orderProduct.id,
        type: POINT_ACTION_TYPE.USE,
        reason: `적립금 사용 - 주문 상품 아이디 : ${orderProduct.id}`,
        amount: amount,
      },
    });

    await payload.update({
      collection: 'users',
      id: user.id,
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
