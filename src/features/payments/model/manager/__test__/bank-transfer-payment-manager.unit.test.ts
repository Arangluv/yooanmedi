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
import { UsePointTransaction } from '@/entities/point/lib/use/point-transaction';
import { createOrderProductSchema } from '@/entities/order-product/model/create-order-product.schema';
import { createRecentPurchasedHistorySchema } from '@/entities/recent-purchased-history/model/create-schema';
import { createOrder as createOrderFromEntityLayer } from '@/entities/order/api/create-order';

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

vi.mock('@/entities/order/api/create-order', () => ({
  createOrder: vi.fn(),
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

    beforeEach(async () => {
      vi.mocked(transformOrderListToInventory).mockResolvedValue(basePaymentInventoryFixture);
      vi.mocked(createOrderFromEntityLayer).mockResolvedValue({ id: 123 } as any);

      const dto = createMockBankTransferDto();
      paymentManager = await createBankTransferManagerFixture(dto);
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('createOrder는 주문을 생성한 후 주문 아이디를 context에 적용한다.', async () => {
      const order = await paymentManager.createOrder();
      paymentManager.applyOrderIdToContext(order.id);

      const context = paymentManager.getContext();

      expect(context.orderId).toBe(order.id);
      expectTypeOf(context).toEqualTypeOf<BankTransferPaymentContextAfterOrder>();
    });
  });
});
