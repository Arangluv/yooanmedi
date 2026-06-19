import { OrderListService, OrderListServiceDependencies } from './order-list.service';
import { OrderListAdapter } from '../api';
import { OrderListApiRepository } from '../repository';

export const createOrderListUsecase = () => {
  const dependencies: OrderListServiceDependencies = {
    repository: {
      orderList: new OrderListApiRepository(OrderListAdapter()),
    },
  };
  return OrderListService(dependencies);
};
