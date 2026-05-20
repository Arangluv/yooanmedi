import { FindOption } from '@/shared';
import { OrderDetailResponse } from '../schemas';

export interface OrderDetailRepository {
  getOrderDetail: (orderId: number, option: FindOption) => Promise<OrderDetailResponse>;
}
