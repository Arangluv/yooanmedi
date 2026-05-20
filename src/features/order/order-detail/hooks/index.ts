import { createUseOrderDetail } from './useOrderDetail';
import { orderDetailUseCase } from '../services';

export const useOrderDetail = createUseOrderDetail(orderDetailUseCase);
