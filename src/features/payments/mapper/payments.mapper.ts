import { zodSafeParse } from '@/shared';
import { pointItemSchema, type PointItem } from '@/entities/point';
import { EnrichedOrderListItem } from '../model/schemas/payment-order-list.schema';
import { PAYMENTS_METHOD } from '@/shared';
import { CartItem } from '@/entities/cart-item';

export class PaymentsMapper {
  static orderListItemToPointItem(data: EnrichedOrderListItem): PointItem {
    const dto: PointItem = {
      rates: {
        [PAYMENTS_METHOD.bank_transfer]: data.product.cashback_rate_for_bank,
        [PAYMENTS_METHOD.credit_card]: data.product.cashback_rate,
      },
      quantity: data.quantity,
      price: data.product.price,
    };

    return zodSafeParse(pointItemSchema, dto);
  }

  static cartItemToPointItem(data: CartItem): PointItem {
    const dto: PointItem = {
      rates: {
        [PAYMENTS_METHOD.bank_transfer]: data.product.cashback_rate_for_bank,
        [PAYMENTS_METHOD.credit_card]: data.product.cashback_rate,
      },
      quantity: data.quantity,
      price: data.product.price,
    };

    return zodSafeParse(pointItemSchema, dto);
  }
}
