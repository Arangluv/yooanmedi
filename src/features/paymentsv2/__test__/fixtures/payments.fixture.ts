import {
  BankTransferPaymentCommandDto,
  BankTransferPaymentRequestDto,
  PGPaymentCommandDto,
  PaymentOrderItemDto,
} from '../../dto';
import { createProductFixture } from '@/entities/product/__test__';
import { EasyPayFixtureUtil } from '@/entities/easypay/__test__';
import { createCartItemFixture } from '@/entities/cart-item/__test__';

const basePaymentOrderItem = {
  product: createProductFixture({ id: 1, price: 3000 }),
  quantity: 3,
  totalAmount: 9000,
  usedPoint: 30,
  deliveryFee: 3000,
} as PaymentOrderItemDto;

export const createPaymentOrderItemDto = (override?: Partial<PaymentOrderItemDto>) => {
  return {
    ...basePaymentOrderItem,
    ...override,
  };
};

export const PaymentFixtures = {
  commandDto: {
    bank: {
      user: {
        id: 3,
        deliveryRequest: '테스트 요청사항',
        usedPoint: 338,
      },
      paymentInfo: {
        orderList: [
          createPaymentOrderItemDto(),
          createPaymentOrderItemDto(),
          createPaymentOrderItemDto(),
        ],
        shopOrderNo: EasyPayFixtureUtil.generateShopOrderNo(),
        totalAmount: 3000,
        paymentMethod: 'bankTransfer',
      },
      minOrderPrice: 30000,
    } as BankTransferPaymentCommandDto,

    pg: {
      user: {
        id: 3,
        deliveryRequest: '테스트 요청사항',
        usedPoint: 338,
      },
      paymentInfo: {
        orderList: [
          createPaymentOrderItemDto(),
          createPaymentOrderItemDto(),
          createPaymentOrderItemDto(),
        ],
        shopOrderNo: EasyPayFixtureUtil.generateShopOrderNo(),
        authorizationId: EasyPayFixtureUtil.generateAuthorizationId(),
        totalAmount: 3000,
        paymentMethod: 'creditCard',
      },
      minOrderPrice: 30000,
    } as PGPaymentCommandDto,
  },

  request: {
    bank: {
      user: {
        id: 1,
        deliveryRequest: '테스트 배송요청 사항',
        usedPoint: 3000,
      },
      paymentInfo: {
        orderList: [
          createCartItemFixture({ id: 1, product: createProductFixture({ id: 1 }) }),
          createCartItemFixture({ id: 2, product: createProductFixture({ id: 2 }) }),
          createCartItemFixture({ id: 3, product: createProductFixture({ id: 3 }) }),
        ],
        totalAmount: 3000,
      },
      minOrderPrice: 30000,
    } as BankTransferPaymentRequestDto,
  },
};
