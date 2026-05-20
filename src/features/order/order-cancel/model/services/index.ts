import {
  createAdminCancelOrderUseCase,
  createClientCancelOrderUseCase,
} from './cancel-order.service.factory';

export const adminCancelOrderUseCase = createAdminCancelOrderUseCase();
export const clientCancelOrderUseCase = createClientCancelOrderUseCase();

export type { AdminCancelOrderUseCase, ClientCancelOrderUseCase } from './order-cancel.usecase';
