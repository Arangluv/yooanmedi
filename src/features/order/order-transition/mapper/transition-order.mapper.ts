import { PAYMENTS_METHOD, ZodSchemaParser } from '@/shared';
import { Order } from '@/entities/order';
import { OrderProduct } from '@/entities/order-product';
import { PointItem, pointItemSchema } from '@/entities/point';
import { TransitionScenarioDefinition } from '../core';
import { TransitionOrderCommandSchema } from '../schemas';
import { PGTransitionOrderCommandDto, BankTransferTransitionOrderCommandDto } from '../dto';

export class TransitionOrderMapper {
  static orderProductToPointItem(orderProduct: OrderProduct): PointItem {
    return ZodSchemaParser.safeParseOrThrow(pointItemSchema, {
      data: {
        rates: {
          [PAYMENTS_METHOD.bank_transfer]: orderProduct.cashback_rate_for_bank,
          [PAYMENTS_METHOD.credit_card]: orderProduct.cashback_rate,
        },
        quantity: orderProduct.quantity,
        price: orderProduct.priceSnapshot,
      } as PointItem,
      errorMsg: '주문상태를 변경하는데 문제가 발생했습니다',
    });
  }

  static toPGCommandDto({
    order,
    scenario,
  }: {
    order: Order;
    scenario: TransitionScenarioDefinition;
  }): PGTransitionOrderCommandDto {
    return ZodSchemaParser.safeParseOrThrow(TransitionOrderCommandSchema.pg, {
      data: { order, ...scenario } as PGTransitionOrderCommandDto,
      errorMsg: '주문상태를 변경하는데 문제가 발생했습니다',
    });
  }

  static toBankCommandDto({
    order,
    scenario,
  }: {
    order: Order;
    scenario: TransitionScenarioDefinition;
  }): BankTransferTransitionOrderCommandDto {
    return ZodSchemaParser.safeParseOrThrow(TransitionOrderCommandSchema.bank, {
      data: { order, ...scenario } as BankTransferTransitionOrderCommandDto,
      errorMsg: '주문상태를 변경하는데 문제가 발생했습니다',
    });
  }
}
