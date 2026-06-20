import { OrderDetailDto, GetOrderDetailRequestDto } from '../dto';

export interface OrderDetailUsecase {
  getOrderDetail: (dto: GetOrderDetailRequestDto) => Promise<OrderDetailDto>;
}
