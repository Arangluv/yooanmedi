import { describe, it, expect, vi } from 'vitest';
import { OrderService } from './service';
import { PGOrderService } from './pg.service';
import { BankTransferOrderService } from './bank-transfer.service';
import { PAYMENTS_METHOD } from '../../constants/payments-method';
import { BusinessLogicError, ZodParseError } from '@/shared/model/errors/domain.error';
import { OrderRepository } from '../../api/repository';
import { PAYMENT_STATUS } from '../../constants/payment-status';
import { FLG_STATUS } from '../../constants/flg-status';
import { ORDER_STATUS } from '../../constants/order-status';
import { generate15digitsNumberBasedOnDate } from '@/shared';

vi.mock('../repository', () => ({
  OrderRepository: {
    create: vi.fn(),
  },
}));

describe('OrderService', () => {
  it('결제방식에 따른 주문서비스를 반환한다.', () => {
    const orderServiceForPG = OrderService.for(PAYMENTS_METHOD.credit_card);
    const orderServiceForBankTransfer = OrderService.for(PAYMENTS_METHOD.bank_transfer);
    expect(orderServiceForPG).toBeInstanceOf(PGOrderService);
    expect(orderServiceForBankTransfer).toBeInstanceOf(BankTransferOrderService);
  });

  it('지정된 결제방식이 아닌 경우 에러를 반환한다', () => {
    expect(() => OrderService.for('invalid' as any)).toThrow(BusinessLogicError);
  });
});

describe('OrderServiceForPG', () => {
  it('주문을 생성한다', async () => {
    const orderServiceForPG = OrderService.for(PAYMENTS_METHOD.credit_card);

    vi.mocked(OrderRepository.create).mockResolvedValue({ id: 1 });
    const orderRequestDto = {
      user: 1,
      orderNo: generate15digitsNumberBasedOnDate(),
      orderRequest: 'test',
      finalPrice: 10000,
      usedPoint: 1000,
    };

    const orderForPG = await orderServiceForPG.createOrder(orderRequestDto);

    expect(orderForPG.id).toBe(1);
    expect(OrderRepository.create).toHaveBeenCalledWith({
      ...orderRequestDto,
      paymentsMethod: PAYMENTS_METHOD.credit_card,
      orderStatus: ORDER_STATUS.preparing,
      flgStatus: FLG_STATUS.init_normal,
      paymentStatus: PAYMENT_STATUS.complete,
    });
  });

  it('주문 생성에 실패하고, 에러를 throw한다', async () => {
    const orderServiceForPG = OrderService.for(PAYMENTS_METHOD.credit_card);
    const orderRequestDto = {
      user: 1,
      orderNo: generate15digitsNumberBasedOnDate(),
    } as any;

    await expect(orderServiceForPG.createOrder(orderRequestDto)).rejects.toThrow(ZodParseError);
  });
});

describe('OrderServiceForBankTransfer', () => {
  it('주문을 생성한다', async () => {
    const orderServiceForBankTransfer = OrderService.for(PAYMENTS_METHOD.bank_transfer);

    vi.mocked(OrderRepository.create).mockResolvedValue({ id: 1 });
    const orderRequestDto = {
      user: 1,
      orderNo: generate15digitsNumberBasedOnDate(),
      orderRequest: 'test',
      finalPrice: 10000,
      usedPoint: 1000,
    };

    const orderForBankTransfer = await orderServiceForBankTransfer.createOrder(orderRequestDto);

    expect(orderForBankTransfer.id).toBe(1);
    expect(OrderRepository.create).toHaveBeenCalledWith({
      ...orderRequestDto,
      paymentsMethod: PAYMENTS_METHOD.bank_transfer,
      orderStatus: ORDER_STATUS.pending,
      flgStatus: FLG_STATUS.init_normal,
      paymentStatus: PAYMENT_STATUS.pending,
    });
  });

  it('주문 생성에 실패하고, 에러를 throw한다', async () => {
    const orderServiceForBankTransfer = OrderService.for(PAYMENTS_METHOD.bank_transfer);
    const orderRequestDto = {
      user: 1,
      orderNo: generate15digitsNumberBasedOnDate(),
    } as any;
    await expect(orderServiceForBankTransfer.createOrder(orderRequestDto)).rejects.toThrow(
      ZodParseError,
    );
  });
});
