import { CreatePaymentHistoryRequestDto } from './schemas/create-payment-history.schema';

export interface IPaymentHistoryService {
  createHistory: (dto: CreatePaymentHistoryRequestDto) => Promise<void>;
}
