import { describe, it, expect } from 'vitest';
import { EasyPayService } from '@/entities/easypay';
import { enrichOrderList } from './enrich-order-list';
import { BusinessLogicError } from '@/shared';
import { BankTransferContextFactory, PGContextFactory } from './context.factory';
import { enrichedOrderListSchema } from './schemas/payment-order-list.schema';
import { createPGBaseContext } from './context.factory.unit.test';
import { bankTransferRequestDtoFixture } from '../__test__/payments.fixture';

describe('enrichOrderList', () => {
  it('[Bank] baseContext orderList에 정보를 추가한다', async () => {
    const contextFactory = new BankTransferContextFactory();
    const baseContext = contextFactory.createBase(bankTransferRequestDtoFixture);

    const orderList = await enrichOrderList(baseContext);
    expect(orderList).toEqual(expect.schemaMatching(enrichedOrderListSchema));
  });

  it('[Bank] baseContext에 담겨있는 상품정보를 찾을 수 없는 경우 Bussiness Error를 throw한다', async () => {
    const contextFactory = new BankTransferContextFactory();
    const baseContext = contextFactory.createBase(bankTransferRequestDtoFixture);
    await expect(
      enrichOrderList({
        ...baseContext,
        orderList: [
          {
            product: {
              id: 9999,
              price: 2000,
            },
            quantity: 3,
          },
        ],
      }),
    ).rejects.toThrow(BusinessLogicError);
  });

  it('[PG] baseContext orderList에 정보를 추가한다', async () => {
    const contextFactory = new PGContextFactory();
    const easypayService = new EasyPayService();

    const { baseContext } = createPGBaseContext(contextFactory, easypayService);
    const orderList = await enrichOrderList(baseContext);
    expect(orderList).toEqual(expect.schemaMatching(enrichedOrderListSchema));
  });

  it('[PG] baseContext에 담겨있는 상품정보를 찾을 수 없는 경우 Bussiness Error를 throw한다', async () => {
    const contextFactory = new PGContextFactory();
    const easypayService = new EasyPayService();

    const { baseContext } = createPGBaseContext(contextFactory, easypayService);
    await expect(
      enrichOrderList({
        ...baseContext,
        orderList: [
          {
            product: {
              id: 9999,
              price: 2000,
            },
            quantity: 3,
          },
        ],
      }),
    ).rejects.toThrow(BusinessLogicError);
  });
});
