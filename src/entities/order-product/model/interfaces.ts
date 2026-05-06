import {
  CreateOrderProductRequestDto,
  CreateOrderProductResponseDto,
} from './schemas/create-order-product.schema';

export interface IOrderProductPaymentService {
  createOrderProduct: (dto: CreateOrderProductRequestDto) => Promise<CreateOrderProductResponseDto>;
}
