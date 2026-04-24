import { describe, it, expect, vi } from 'vitest';
import { PaymentHistoryService } from '../payment-history.service';
import { PaymentHistoryRepository } from '../../api/payment-history.repository';
import { PAYMENTS_METHOD } from '@/entities/order';

vi.mock('../../api/payment-history.repository', () => ({
  PaymentHistoryRepository: {
    create: vi.fn(),
  },
}));

describe('PaymentHistoryService', () => {
  it('주문 결제 히스토리를 생성한다', async () => {
    const service = new PaymentHistoryService();
    const dto = {
      order: 1,
      amount: 10000,
      pgCno: '12345678901234567890',
    };

    await service.createHistory(dto);
    expect(PaymentHistoryRepository.create).toBeCalledTimes(1);
  });

  it('주문 결제 히스토리를 생성시 결제방법이 추가되어 함수를 호출한다', async () => {
    const service = new PaymentHistoryService();
    const dto = {
      order: 1,
      amount: 10000,
      pgCno: '12345678901234567890',
    };

    await service.createHistory(dto);
    expect(PaymentHistoryRepository.create).toBeCalledWith({
      ...dto,
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
    });
  });
});
