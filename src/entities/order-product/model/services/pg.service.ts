import { IOrderProductService } from '../interfaces';
import { zodSafeParse } from '@/shared/lib/zod';
import {
  createCreditCardOrderProductSchema,
  CreateOrderProductRequestDto,
  CreateOrderProductResponseDto,
} from '../schemas/create-order-product.schema';
import { OrderProductRepository } from '../repository';

export class PGOrderProductService implements IOrderProductService {
  async createOrderProduct(
    dto: CreateOrderProductRequestDto,
  ): Promise<CreateOrderProductResponseDto> {
    const entity = zodSafeParse(createCreditCardOrderProductSchema, dto);
    const orderProduct = await OrderProductRepository.create(entity);

    return orderProduct;
  }
}
