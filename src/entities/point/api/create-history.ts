import { PointActionType } from '../constants/point-action-type';
import { getPayload } from '@/shared/lib/get-payload';

interface CreatePointHistoryParams {
  target: {
    user: number;
    orderProduct: number;
  };
  amount: number;
  type: PointActionType;
}

export const createPointHistory = async ({ target, type, amount }: CreatePointHistoryParams) => {
  const payload = await getPayload();
  const { user, orderProduct } = target;

  await payload.create({
    collection: 'point-transaction',
    data: {
      amount: amount,
      user: user,
      orderProduct: orderProduct,
      type: type,
    },
  });
};
