import {
  BankTransferPaymentCommandDto,
  BankTransferPaymentRequestDto,
  PGPaymentCommandDto,
  PGPaymentRequestDto,
  PaymentOrderItemDto,
} from '../../dto';
import { createProductFixture } from '@/entities/product/__test__';
import { EasyPayFixtureUtil } from '@/entities/easypay/__test__';
import { createCartItemFixture } from '@/entities/cart-item/__test__';
import { PAYMENTS_METHOD } from '@/shared';

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

const basePGPaymentRequestDto = new FormData();
basePGPaymentRequestDto.append('authorizationId', EasyPayFixtureUtil.generateAuthorizationId());
basePGPaymentRequestDto.append('shopOrderNo', EasyPayFixtureUtil.generateShopOrderNo());
basePGPaymentRequestDto.append('shopValue1', '테스트 요청사항');
basePGPaymentRequestDto.append(
  'shopValue2',
  '[{"product":{"id":1,"price":12500},"quantity":3},{"product":{"id":2,"price":16800},"quantity":2},{"product":{"id":3,"price":8788},"quantity":1}]',
);
basePGPaymentRequestDto.append('shopValue3', '2300'); // usedPoint
basePGPaymentRequestDto.append('shopValue4', '1');
basePGPaymentRequestDto.append('shopValue5', PAYMENTS_METHOD.credit_card);
basePGPaymentRequestDto.append('shopValue6', '30000');

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
          createCartItemFixture({
            id: 1,
            product: createProductFixture({ id: 1, price: 13516 }),
            quantity: 3,
          }),
          createCartItemFixture({
            id: 2,
            product: createProductFixture({ id: 2, price: 3568 }),
            quantity: 4,
          }),
          createCartItemFixture({
            id: 3,
            product: createProductFixture({ id: 3, price: 8356 }),
            quantity: 5,
          }),
        ],
        totalAmount: 3000,
      },
      minOrderPrice: 30000,
    } as BankTransferPaymentRequestDto,

    pg: basePGPaymentRequestDto as PGPaymentRequestDto,
  },
};
