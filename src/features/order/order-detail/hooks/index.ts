import { createUseOrderDetail } from './useOrderDetail';
import { orderDetailUseCase } from '../core';

export const useOrderDetail = createUseOrderDetail(orderDetailUseCase);
