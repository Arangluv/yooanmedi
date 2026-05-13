import { FindOption } from '@/shared';
import { PaymentHistoryRepository } from '../api/repository';

export class PaymentHistoryService {
  public async getPaymentsHistory(orderId: number) {
    const option: FindOption = {
      pagination: false,
      limit: 1,
      where: {
        order: {
          equals: orderId,
        },
      },
    };

    return PaymentHistoryRepository.findOne(option);
  }
}
