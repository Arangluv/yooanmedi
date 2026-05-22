import { AdminOrderListApiRepository, ClientOrderListApiRepository } from '../repository/index';
import { AdminOrderListService } from './admin.order-list.service';
import { ClientOrderListService } from './client.order-list.service';

export const createAdminOrderListService = () => {
  const orderListRepository = new AdminOrderListApiRepository();
  return AdminOrderListService(orderListRepository);
};

export const createClientOrderListService = () => {
  const orderListRepository = new ClientOrderListApiRepository();
  return ClientOrderListService(orderListRepository);
};
