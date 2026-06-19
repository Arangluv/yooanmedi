import { OrderListService, OrderListServiceDependencies } from './order-list.service';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { OrderListAdapter } from '../api';
import { OrderListApiRepository } from '../repository';

export const createOrderListUsecase = () => {
  const dependencies: OrderListServiceDependencies = {
    repository: {
      orderList: new OrderListApiRepository(OrderListAdapter()),
      user: new UserApiRepository(UserAdapter()),
    },
  };

  return OrderListService(dependencies);
};
