import { OrderDetailApiRepository } from '../repository';
import { OrderDetailService } from './order-detail.service';

export const createOrderDetailService = () => {
  const orderDetailRepository = new OrderDetailApiRepository();
  return OrderDetailService(orderDetailRepository);
};
