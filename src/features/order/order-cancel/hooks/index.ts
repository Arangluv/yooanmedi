import { createUseAdminCancelOrder, createUseClientCancelOrder } from './useCancelOrder';
import { adminCancelOrderUseCase, clientCancelOrderUseCase } from '../core';

export const useAdminCancelOrder = createUseAdminCancelOrder(adminCancelOrderUseCase);
export const useClientCancelOrder = createUseClientCancelOrder(clientCancelOrderUseCase);
