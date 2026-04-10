import { zodSafeParse } from '@/shared/lib/zod';
import { IOrderProductService } from '../interfaces';
import {
  createBankTransferOrderProductSchema,
  CreateOrderProductRequestDto,
  CreateOrderProductResponseDto,
} from '../schemas/create-order-product.schema';
import { OrderProductRepository } from '../repository';

export class BankTransferOrderProductService implements IOrderProductService {
  async createOrderProduct(
    dto: CreateOrderProductRequestDto,
  ): Promise<CreateOrderProductResponseDto> {
    const entity = zodSafeParse(createBankTransferOrderProductSchema, dto);
    const orderProduct = await OrderProductRepository.create(entity);

    return orderProduct;
  }
}
