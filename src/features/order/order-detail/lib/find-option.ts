import { FindOption } from '@/shared';

export const OrderDetailFindOption = {
  build: (): FindOption => {
    return {
      pagination: false,
      depth: 3,
      populate: {
        'order-product': {
          product: true,
          orderProductStatus: true,
          productNameSnapshot: true,
          priceSnapshot: true,
          totalAmount: true,
          productDeliveryFee: true,
          quantity: true,
        },
        product: {
          name: true,
          image: true,
          insurance_code: true,
          specification: true,
          manufacturer: true,
          ingredient: true,
        },
      },
    };
  },
};
