'use server';

import { POINT_ACTION } from '../../constants/point-action';
import { getPointTransactionContext } from '../get-point-transaction-context';

interface GetUsedPointParams {
  userId: number;
  orderProductId: number;
}

export const getUsedPoint = async ({ userId, orderProductId }: GetUsedPointParams) => {
  try {
    const { payload, user, orderProduct } = await getPointTransactionContext({
      userId,
      orderProductId,
    });

    const { docs: pointTransaction } = await payload.find({
      collection: 'point-transaction',
      where: {
        user: {
          equals: user.id,
        },
        orderProduct: {
          equals: orderProduct.id,
        },
        type: {
          equals: POINT_ACTION.USE,
        },
      },
      limit: 1,
    });

    return pointTransaction;
  } catch (error) {
    console.log(error);
    throw new Error('사용된 적립금을 가져오는데 실패했습니다');
  }
};
