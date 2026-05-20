import { EndPointResult } from '@/shared';
import { OrderDetailDto } from '../schemas';

export interface OrderDetailUseCase {
  getOrderDetail: (orderId: number) => Promise<EndPointResult<OrderDetailDto>>;
}
