import {
  createAdminCancelOrderService,
  createClientCancelOrderService,
} from './cancel-order.service.factory';

export const adminCancelOrderService = createAdminCancelOrderService();
export const clientCancelOrderService = createClientCancelOrderService();

export type { AdminCancelOrderUseCase, ClientCancelOrderUseCase } from './order-cancel.usecase';
