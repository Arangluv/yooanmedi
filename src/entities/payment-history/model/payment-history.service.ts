import { IPaymentHistoryService } from './payment-history.interfaces';
import {
  CreatePaymentHistoryRequestDto,
  createPaymentHistoryRequestSchema,
} from './schemas/create-payment-history.schema';
import { zodSafeParse } from '@/shared/lib/zod';
import { PaymentHistoryRepository } from '../api/payment-history.repository';

export class PaymentHistoryService implements IPaymentHistoryService {
  public async createHistory(dto: CreatePaymentHistoryRequestDto) {
    const entity = zodSafeParse(createPaymentHistoryRequestSchema, dto);
    await PaymentHistoryRepository.create(entity);
  }
}
