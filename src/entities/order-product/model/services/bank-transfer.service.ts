/** TODO :: refactoring -> order-product.service.ts로 로직 이동 */
import { zodSafeParse } from '@/shared/lib/zod';
import { IOrderProductPaymentService } from '../interfaces';
import {
  createBankTransferOrderProductSchema,
  CreateOrderProductRequestDto,
  CreateOrderProductResponseDto,
} from '../schemas/create-order-product.schema';
import { OrderProductRepository } from '../repository';

export class BankTransferOrderProductPaymentService implements IOrderProductPaymentService {
  async createOrderProduct(
    dto: CreateOrderProductRequestDto,
  ): Promise<CreateOrderProductResponseDto> {
    const entity = zodSafeParse(createBankTransferOrderProductSchema, dto);
    const orderProduct = await OrderProductRepository.create(entity);

    return orderProduct;
  }
}
