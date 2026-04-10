import {
  CreateOrderProductRequestDto,
  CreateOrderProductResponseDto,
} from './schemas/create-order-product.schema';

export interface IOrderProductService {
  createOrderProduct: (dto: CreateOrderProductRequestDto) => Promise<CreateOrderProductResponseDto>;
}
