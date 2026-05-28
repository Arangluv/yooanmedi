import { PAYMENTS_METHOD, zodSafeParse } from '@/shared';
import { Order } from '@/entities/order';
import { TransitionConfigDefinition } from '../constants';
import { transitionOrderContextSchema } from '../schemas';
import { PointItem, pointItemSchema } from '@/entities/point';
import { OrderProduct } from '@/entities/order-product';

export class TransitionOrderMapper {
  static toContext(order: Order, config: TransitionConfigDefinition) {
    return zodSafeParse(transitionOrderContextSchema, { order, ...config });
  }

  static orderProductToPointItem(orderProduct: OrderProduct): PointItem {
    const dto: PointItem = {
      rates: {
        [PAYMENTS_METHOD.bank_transfer]: orderProduct.cashback_rate_for_bank,
        [PAYMENTS_METHOD.credit_card]: orderProduct.cashback_rate,
      },
      quantity: orderProduct.quantity,
      price: orderProduct.priceSnapshot,
    };

    return zodSafeParse(pointItemSchema, dto);
  }
}
