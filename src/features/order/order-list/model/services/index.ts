import {
  createAdminOrderListService,
  createClientOrderListService,
} from './order-list.service-factory';

export const adminOrderListService = createAdminOrderListService();

export const clientOrderListService = createClientOrderListService();
