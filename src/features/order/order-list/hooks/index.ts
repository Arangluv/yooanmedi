import { adminOrderListUseCase, clientOrderListUseCase } from '../services';
import { createUseAdminOrderList, createUseClientOrderList } from './useOrderList';

export const useAdminOrderList = createUseAdminOrderList(adminOrderListUseCase);
export const useClientOrderList = createUseClientOrderList(clientOrderListUseCase);
