'use server';

import { getPayload } from '@/shared/lib/get-payload';

export const getOrderDetailById = async (id: number) => {
  const payload = await getPayload();

  const order = await payload.findByID({
    collection: 'order',
    id,
    select: {
      user: true,
      orderStatus: true,
      flgStatus: true,
      paymentStatus: true,
      orderProducts: true,
      paymentsMethod: true,
      orderRequest: true,
      orderNo: true,
      finalPrice: true,
      usedPoint: true,
      updatedAt: true,
      createdAt: true,
    },
    populate: {
      users: {
        hospitalName: true,
        phoneNumber: true,
        email: true,
        address: true,
        ceo: true,
      },
      product: {
        image: true,
      },
      'order-product': {
        product: true,
        productNameSnapshot: true,
        productDeliveryFee: true,
        priceSnapshot: true,
        totalAmount: true,
        quantity: true,
        orderProductStatus: true,
      },
    },
    depth: 4,
  });

  return order;
};
