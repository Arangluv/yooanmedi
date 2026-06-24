import { getPayload } from '@/shared/server';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import {
  OrderProductAdapter,
  OrderProductApiRepository,
} from '@/entities/order-product/infrastructure';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
import {
  TransitionOrderService,
  TransitionOrderServiceDependencies,
} from './transition-order.service';

export const createTransitionOrderService = async () => {
  const dependencies: TransitionOrderServiceDependencies = {
    payload: await getPayload(),
    repository: {
      order: new OrderApiRepository(OrderAdapter()),
      orderProduct: new OrderProductApiRepository(OrderProductAdapter()),
      user: new UserApiRepository(UserAdapter()),
      pointHistory: new PointHistoryApiRepository(PointHistoryAdapter()),
    },
  };

  return TransitionOrderService(dependencies);
};
