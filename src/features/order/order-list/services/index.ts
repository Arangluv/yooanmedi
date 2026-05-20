import {
  createAdminOrderListService,
  createClientOrderListService,
} from './order-list.service-factory';

export const adminOrderListUseCase = createAdminOrderListService();

export const clientOrderListUseCase = createClientOrderListService();
