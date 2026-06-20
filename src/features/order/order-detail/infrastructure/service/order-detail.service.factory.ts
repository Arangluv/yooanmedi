import { OrderDetailApiRepository } from '../repository';
import { OrderDetailAdapter } from '../api';
import { OrderDetailService, OrderDetailServiceDependencies } from './order-detail.service';

export const createOrderDetailUsecase = () => {
  const dependencies: OrderDetailServiceDependencies = {
    repository: {
      orderDetail: new OrderDetailApiRepository(OrderDetailAdapter()),
    },
  };

  return OrderDetailService(dependencies);
};
