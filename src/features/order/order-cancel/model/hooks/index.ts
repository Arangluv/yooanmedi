import { adminCancelOrderUseCase, clientCancelOrderUseCase } from '../services';
import { createUseAdminCancelOrder, createUseClientCancelOrder } from './useCancelOrder';

export const useAdminCancelOrder = createUseAdminCancelOrder(adminCancelOrderUseCase);
export const useClientCancelOrder = createUseClientCancelOrder(clientCancelOrderUseCase);
