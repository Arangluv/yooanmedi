'use server';

/** TODO:: 해당 함수는 더이상 사용하지 않으므로 삭제 */

import { getPayload } from '@/shared';
import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
import { cancelOrderProductSchema } from '@/entities/order-product';
import { cancelBankTransferStrategy } from '../lib/cancel-banktransfer/strategy';
import { cancelCardPaymentStrategy } from '../lib/cancel-card-strategy';

type CancelOrderProductParams = {
  orderProductId: number;
  clientSideFlg: boolean;
};

export const cancelOrderProduct = async ({
  orderProductId,
  clientSideFlg,
}: CancelOrderProductParams) => {
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

    await strategy.execute({ payload, orderProduct: targetOrderProduct, clientSideFlg });
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
