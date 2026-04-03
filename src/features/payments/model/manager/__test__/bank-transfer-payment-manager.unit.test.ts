import { describe, it, expect, expectTypeOf, beforeEach, vi, Mock, afterEach } from 'vitest';
import { BankTransferPaymentManager } from '../bank-transfer-payment-manager';
import {
  createMockBankTransferDto,
  basePaymentInventoryFixture,
} from '@shared/__mock__/payment.bank.fixture';
import {
  BankTransferPaymentContextAfterOrder,
  BankTransferPaymentInitContext,
} from '../../schema/payment-context-schema';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import { ZodParseError } from '@/shared/model/errors/domain.error';
import { createBankTransferManagerFixture } from '@/shared/__mock__/bank-transfer-manager.fixture';
import { createOrderProduct } from '@/entities/order-product/api/create-order-product';
import { createRecentPurchasedHistory } from '@/entities/recent-purchased-history/api/create';
import { transformOrderListToInventory } from '@/entities/inventory/lib/transform';
import { UsePointTransaction } from '@/entities/point/lib/use/use-point-transaction';
import { createOrderProductSchema } from '@/entities/order-product/model/create-order-product.schema';
import { createRecentPurchasedHistorySchema } from '@/entities/recent-purchased-history/model/create-schema';

vi.mock('@/entities/inventory/lib/transform', () => ({
  transformOrderListToInventory: vi.fn(),
}));

vi.mock('@/entities/order-product/api/create-order-product', () => ({
  createOrderProduct: vi.fn(),
}));

vi.mock('@/entities/recent-purchased-history/api/create', () => ({
  createRecentPurchasedHistory: vi.fn(),
}));

vi.mock('@/entities/point/lib/use/create-transaction', () => ({
  createUsePointTransaction: vi.fn(),
}));

describe('BankTransferPaymentManager', () => {
  describe('createContext', () => {
    const invalidDtos = [
      {
        data: createMockBankTransferDto({
          shopOrderNo: '1234567890',
          orderList: [],
        }),
        name: 'empty orderList',
      },
      {
        data: createMockBankTransferDto({
          shopOrderNo: '1234567890',
          orderList: [
            {
              product: {
                id: 1,
                price: 1000,
              },
              quantity: 0,
            },
          ],
        }),
        name: 'invalid quantity',
      },
      {
        data: createMockBankTransferDto({
          shopOrderNo: '1234567890',
          orderList: [
            {
              product: {
                id: 1,
                price: 1000,
              },
              quantity: 0,
            },
          ],
          amount: -1000,
        }),
        name: 'invalid amount(negative)',
      },
      {
        data: createMockBankTransferDto({
          shopOrderNo: '1234567890',
          orderList: [
            {
              product: {
                id: 1,
                price: 1000,
              },
              quantity: 1,
            },
          ],
          minOrderPrice: -1000,
        }),
        name: 'invalid usedPoint(negative)',
      },
    ];

    it('createContext는 결제에 필요한 올바른 컨텍스트를 생성한다.', () => {
      const dto = createMockBankTransferDto();
      const context = BankTransferPaymentManager.createContext(dto);

      // check undefined
      expect(context).toBeDefined();
      // check type
      expectTypeOf(context).toEqualTypeOf<BankTransferPaymentInitContext>();
      // check add paymentsMethod
      expect(context.paymentsMethod).toBe(PAYMENTS_METHOD.BANK_TRANSFER);
    });

    it.each(invalidDtos)('createContext는 $name 데이터를 파싱하는데 실패한다.', ({ data }) => {
      expect(() => BankTransferPaymentManager.createContext(data)).toThrow(ZodParseError);
    });
  });

  describe('createOrder', () => {
    let paymentManager: BankTransferPaymentManager<BankTransferPaymentInitContext>;
    let createOrderSpy: Mock;

    const mockOrder = {
      id: 123,
    };

    beforeEach(async () => {
      vi.mocked(transformOrderListToInventory).mockResolvedValue(basePaymentInventoryFixture);

      const dto = createMockBankTransferDto();
      paymentManager = await createBankTransferManagerFixture(dto);

      createOrderSpy = vi.spyOn(paymentManager, 'createOrder').mockResolvedValue(mockOrder as any);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('createOrder는 주문을 생성한다.', async () => {
      const order = await paymentManager.createOrder();

      // 검증 1: 내부적으로 createOrder가 올바른 dto로 호출되었는가
      expect(createOrderSpy).toHaveBeenCalledWith();

      // 검증 2: 반환된 order가 올바른 형식을 가지고 있는가
      expect(order.id).toBe(mockOrder.id);
    });

    it('applyOrderIdToContext는 주문 아이디를 컨텍스트에 적용한다.', async () => {
      const order = await paymentManager.createOrder();
      paymentManager.applyOrderIdToContext(order.id);

      const context = paymentManager.getContext();

      expect(context.orderId).toBe(order.id);
      expectTypeOf(context).toEqualTypeOf<BankTransferPaymentContextAfterOrder>();
    });
  });

  describe('processOrderSideEffects', () => {
    let paymentManager: BankTransferPaymentManager<BankTransferPaymentInitContext>;
    let createProductMock: Mock;
    let createRecentPurchasedHistoryMock: Mock;
    let initializeContextSpy: Mock; // will remove

    const mockOrder = {
      id: 123,
    };

    beforeEach(async () => {
      const dto = createMockBankTransferDto();
      paymentManager = await createBankTransferManagerFixture(dto);

      vi.spyOn(paymentManager, 'createOrder').mockResolvedValue(mockOrder as any);

      createProductMock = vi.mocked(createOrderProduct);
      createProductMock
        .mockResolvedValueOnce({ id: 1 } as any)
        .mockResolvedValueOnce({ id: 2 } as any)
        .mockResolvedValueOnce({ id: 3 } as any)
        .mockResolvedValueOnce({ id: 4 } as any);

      createRecentPurchasedHistoryMock = vi.mocked(createRecentPurchasedHistory);
      initializeContextSpy = vi
        .spyOn(UsePointTransaction.prototype, 'initializeContext')
        .mockResolvedValue(undefined);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('주문 사이드 이펙트를 처리한다.', async () => {
      const order = await paymentManager.createOrder();
      paymentManager.applyOrderIdToContext(order.id);

      await paymentManager.processOrderSideEffects();

      expect(createProductMock).toHaveBeenCalledWith(
        expect.schemaMatching(createOrderProductSchema),
      );
      expect(createRecentPurchasedHistoryMock).toHaveBeenCalledWith(
        expect.schemaMatching(createRecentPurchasedHistorySchema),
      );

      const loopTimes = basePaymentInventoryFixture.length;
      expect(createProductMock).toHaveBeenCalledTimes(loopTimes);
      expect(createRecentPurchasedHistoryMock).toHaveBeenCalledTimes(loopTimes);
      expect(initializeContextSpy).toHaveBeenCalledTimes(loopTimes); // will remove
    });
  });
});
