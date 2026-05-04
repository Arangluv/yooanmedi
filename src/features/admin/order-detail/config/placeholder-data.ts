import { ORDER_STATUS, PAYMENTS_METHOD } from '@/entities/order';
import { PAYMENT_STATUS } from '@/entities/order/constants/payment-status';

export const placeholderData = {
  orderInfo: {
    id: 0,
    createdAt: '',
    updatedAt: '',
    orderNo: '',
    progressOrder: {
      inProgressOrderStatus: ORDER_STATUS.pending,
      orderProducts: [],
    },
    cancelRequestOrder: {
      orderProducts: [],
    },
    cancelledOrder: {
      orderProducts: [],
    },
  },
  paymentInfo: {
    paymentMethod: PAYMENTS_METHOD.credit_card,
    paymentStatus: PAYMENT_STATUS.pending,
    usedPoint: 0,
    finalPrice: 0,
  },
  orderUserInfo: {
    id: 0,
    hospitalName: '',
    phoneNumber: '',
    email: '',
    ceo: '',
  },
  deliveryInfo: {
    address: '',
    orderRequest: '',
  },
};
