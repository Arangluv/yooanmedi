import { OrderDetailDto, GetOrderDetailRequestDto } from '../dto';

export interface OrderDetailRepository {
  getOrderDetail: (dto: GetOrderDetailRequestDto) => Promise<OrderDetailDto>;
}
