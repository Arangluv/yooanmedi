import { FindOption } from '@/shared';
import { PaymentHistory } from '../types';
import { CreatePaymentHistorRequestyDto } from '../dto';

export interface PaymentHistoryRepository {
  create: (dto: CreatePaymentHistorRequestyDto) => Promise<PaymentHistory>;
  findOne: (option: FindOption) => Promise<PaymentHistory>;
}
