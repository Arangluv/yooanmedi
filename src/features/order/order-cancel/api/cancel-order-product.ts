'use server';

import { getPayload } from '@/shared';
import { PAYMENTS_METHOD } from '@/entities/order';
import { cancelOrderProductSchema } from '@/entities/order-product';
import { cancelBankTransferStrategy } from '../lib/cancel-banktransfer/strategy';
import { cancelCardPaymentStrategy } from '../lib/cancel-card-strategy';

export const cancelOrderProduct = async (orderProductId: number) => {
  try {
    const payload = await getPayload();

    const orderProduct = await payload.findByID({
      collection: 'order-product',
      id: orderProductId,
      select: {
        order: true,
        orderProductStatus: true,
        priceSnapshot: true,
        productDeliveryFee: true,
        quantity: true,
        totalAmount: true,
      },
      populate: {
        product: {},
        users: {},
        order: {
          user: true,
          paymentsMethod: true,
          orderStatus: true,
          usedPoint: true,
        },
      },
    });
    const targetOrderProduct = cancelOrderProductSchema.parse(orderProduct);
    const strategy =
      targetOrderProduct.paymentsMethod === PAYMENTS_METHOD.CREDIT_CARD
        ? cancelCardPaymentStrategy
        : cancelBankTransferStrategy;

    await strategy.execute({ payload, orderProduct: targetOrderProduct });
    return {
      success: true,
    };
  } catch (error) {
    // TODO :: error 핸들링
    return {
      success: false,
      message: '주문 상품을 취소하는데 문제가 발생했습니다',
    };
  }
};
