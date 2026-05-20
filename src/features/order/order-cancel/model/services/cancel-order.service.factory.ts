import { adminCancelOrderUseCase } from './admin.cancel-order.service';
import { clientCancelOrderUseCase } from './client-cancel-order.service';

export const createAdminCancelOrderUseCase = () => {
  return adminCancelOrderUseCase();
};

export const createClientCancelOrderUseCase = () => {
  return clientCancelOrderUseCase();
};
