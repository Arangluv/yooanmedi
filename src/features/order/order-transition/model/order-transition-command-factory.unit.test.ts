import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createOrderFixture, toOrderSchema, ORDER_STATUS } from '@/entities/order';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import { OrderTransitionCommandFactory } from './order-transition-command-factory';
import { OrderTransitionCommand } from './order-transition-command';

describe('OrderTransitionCommandFactory', () => {
  it.each([
    {
      to: 'pending',
      from: 'preparing',
      dto: createOrderFixture({ orderStatus: ORDER_STATUS.pending }),
      expectdContaining: {
        fromOrderStatus: ORDER_STATUS.pending,
        toStatus: ORDER_STATUS.preparing,
        fromOrderProductStatus: ORDER_PRODUCT_STATUS.pending,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.preparing,
      },
    },
    {
      to: 'preparing',
      from: 'shipping',
      dto: createOrderFixture({ orderStatus: ORDER_STATUS.preparing }),
      expectdContaining: {
        fromOrderStatus: ORDER_STATUS.preparing,
        toStatus: ORDER_STATUS.shipping,
        fromOrderProductStatus: ORDER_PRODUCT_STATUS.preparing,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
      },
    },
    {
      to: 'shipping',
      from: 'delivered',
      dto: createOrderFixture({ orderStatus: ORDER_STATUS.shipping }),
      expectdContaining: {
        fromOrderStatus: ORDER_STATUS.shipping,
        toStatus: ORDER_STATUS.delivered,
        fromOrderProductStatus: ORDER_PRODUCT_STATUS.shipping,
        toOrderProductStatus: ORDER_PRODUCT_STATUS.delivered,
      },
    },
  ])(
    '주문이 $to 상태인 경우 -> $from 상태를 위한 command가 생성된다',
    ({ dto, expectdContaining }) => {
      const command = OrderTransitionCommandFactory.createCommand(dto);

      expect(command).toBeInstanceOf(OrderTransitionCommand);
      expect(command.context).toMatchObject(expectdContaining);
    },
  );

  it('지원하지 않는 주문상태라면 error를 throw한다', () => {
    const dto = createOrderFixture({ orderStatus: 'INVALID_STATUS' } as any);
    expect(() => OrderTransitionCommandFactory.createCommand(dto)).toThrowError();
  });

  it('delivered 상태인 주문은 최종상태이므로 error를 throw한다', () => {
    const dto = createOrderFixture({ orderStatus: 'delivered' });
    expect(() => OrderTransitionCommandFactory.createCommand(dto)).toThrowError();
  });
});
