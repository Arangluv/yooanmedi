import { PaymentHistory } from '../types';
import { CreatePaymentHistorRequestyDto } from '../dto';

export interface PaymentHistoryRepository {
  create: (dto: CreatePaymentHistorRequestyDto) => Promise<PaymentHistory>;
  findByOrderId: (orderId: number) => Promise<PaymentHistory>;
}
