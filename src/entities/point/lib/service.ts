import { createPointHistory } from '../api/create-history';
import { getOrderProduct } from '../api/order-product';
import { getUser } from '../api/user';
import { userSchema, orderProductSchema } from '../model/schema/point-transaction.schema';
import { zodSafeParse } from '@/shared/lib/zod';
import { PointActionType } from '../constants/point-action';
import { updateUserPoint } from '../api/increment-point';

// todo:: zod로 관리해야한다
interface CreatePointHistoryParams {
  target: {
    user: number;
    orderProduct: number;
  };
  amount: number;
  type: PointActionType;
}

interface UpdateUserPointParams {
  targetUser: number;
  willUpdatePoint: number;
}

// todo :: 각각의 entity로 옮겨야한다.
const PointService = {
  findTargetUser: async (id: number) => {
    const user = await getUser(id);
    const result = zodSafeParse(userSchema, user);
    return result;
  },

  findTargetOrderProduct: async (id: number) => {
    const orderProduct = await getOrderProduct(id);
    const result = zodSafeParse(orderProductSchema, orderProduct);
    return result;
  },

  createPointHistory: async (params: CreatePointHistoryParams) => {
    await createPointHistory(params);
  },

  // todo: User Entity로
  updateUserPoint: async ({ targetUser, willUpdatePoint }: UpdateUserPointParams) => {
    await updateUserPoint({ targetUser, willUpdatePoint });
  },
};

export default PointService;
