import { AdminCancelOrderService } from './admin.cancel-order.service';
import { ClientCancelOrderService } from './client-cancel-order.service';

export const createAdminCancelOrderService = () => {
  return AdminCancelOrderService();
};

export const createClientCancelOrderService = () => {
  return ClientCancelOrderService();
};
