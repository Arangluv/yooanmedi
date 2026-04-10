import { describe, it, expect, vi } from 'vitest';
import { OrderService } from '../services/service';
import { PGOrderService } from '../services/pg.service';
import { BankTransferOrderService } from '../services/bank-transfer.service';
import { PAYMENTS_METHOD } from '../../constants/payments-options';
import { BusinessLogicError, ZodParseError } from '@/shared/model/errors/domain.error';
import { OrderRepository } from '../repository';
import { generateShopOrderNo } from '@/features/payments/lib/order-uuid'; // -> todo :: refactoring이 필요하다
import { PAYMENT_STATUS } from '../../constants/payment-status';
import { FLG_STATUS } from '../../constants/flg-status';
import { ORDER_STATUS } from '../../constants/order-status';

vi.mock('../repository', () => ({
  OrderRepository: {
    create: vi.fn(),
  },
}));

describe('OrderService', () => {
  it('결제방식에 따른 주문서비스를 반환한다.', () => {
    const orderServiceForPG = OrderService.for(PAYMENTS_METHOD.CREDIT_CARD);
    const orderServiceForBankTransfer = OrderService.for(PAYMENTS_METHOD.BANK_TRANSFER);
    expect(orderServiceForPG).toBeInstanceOf(PGOrderService);
    expect(orderServiceForBankTransfer).toBeInstanceOf(BankTransferOrderService);
  });

  it('지정된 결제방식이 아닌 경우 에러를 반환한다', () => {
    expect(() => OrderService.for('invalid' as any)).toThrow(BusinessLogicError);
  });
});

describe('OrderServiceForPG', () => {
  it('주문을 생성한다', async () => {
    const orderServiceForPG = OrderService.for(PAYMENTS_METHOD.CREDIT_CARD);

    vi.mocked(OrderRepository.create).mockResolvedValue({ id: 1 });
    const orderRequestDto = {
      user: 1,
      orderNo: generateShopOrderNo(),
      orderRequest: 'test',
      finalPrice: 10000,
      usedPoint: 1000,
    };

    const orderForPG = await orderServiceForPG.createOrder(orderRequestDto);

    expect(orderForPG.id).toBe(1);
    expect(OrderRepository.create).toHaveBeenCalledWith({
      ...orderRequestDto,
      paymentsMethod: PAYMENTS_METHOD.CREDIT_CARD,
      orderStatus: ORDER_STATUS.PREPARING,
      flgStatus: FLG_STATUS.INIT_NORMAL,
      paymentStatus: PAYMENT_STATUS.COMPLETE,
    });
  });

  it('주문 생성에 실패하고, 에러를 throw한다', async () => {
    const orderServiceForPG = OrderService.for(PAYMENTS_METHOD.CREDIT_CARD);
    const orderRequestDto = {
      user: 1,
      orderNo: generateShopOrderNo(),
    } as any;

    await expect(orderServiceForPG.createOrder(orderRequestDto)).rejects.toThrow(ZodParseError);
  });
});

describe('OrderServiceForBankTransfer', () => {
  it('주문을 생성한다', async () => {
    const orderServiceForBankTransfer = OrderService.for(PAYMENTS_METHOD.BANK_TRANSFER);

    vi.mocked(OrderRepository.create).mockResolvedValue({ id: 1 });
    const orderRequestDto = {
      user: 1,
      orderNo: generateShopOrderNo(),
      orderRequest: 'test',
      finalPrice: 10000,
      usedPoint: 1000,
    };

    const orderForBankTransfer = await orderServiceForBankTransfer.createOrder(orderRequestDto);

    expect(orderForBankTransfer.id).toBe(1);
    expect(OrderRepository.create).toHaveBeenCalledWith({
      ...orderRequestDto,
      paymentsMethod: PAYMENTS_METHOD.BANK_TRANSFER,
      orderStatus: ORDER_STATUS.PENDING,
      flgStatus: FLG_STATUS.INIT_NORMAL,
      paymentStatus: PAYMENT_STATUS.PENDING,
    });
  });

  it('주문 생성에 실패하고, 에러를 throw한다', async () => {
    const orderServiceForBankTransfer = OrderService.for(PAYMENTS_METHOD.BANK_TRANSFER);
    const orderRequestDto = {
      user: 1,
      orderNo: generateShopOrderNo(),
    } as any;
    await expect(orderServiceForBankTransfer.createOrder(orderRequestDto)).rejects.toThrow(
      ZodParseError,
    );
  });
});
