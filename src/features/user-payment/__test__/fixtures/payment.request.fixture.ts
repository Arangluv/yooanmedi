import { createCartItemFixture } from '@/entities/cart-item/__test__';
import { EasyPayFixtureUtil } from '@/entities/easypay/__test__';
import { createProductFixture } from '@/entities/product/__test__';
import { PAYMENTS_METHOD } from '@/shared';
import { BankTransferPaymentRequestDto, PGPaymentRequestDto } from '../../dto';

export const PaymentRequestDtos = {
  zeroTotalAmount: {
    // subtotal : 96600, total: 0 (96600 - 96600)
    bank: (): BankTransferPaymentRequestDto => ({
      user: {
        id: 1,
        deliveryRequest: '테스트 배송요청 사항',
        usedPoint: 96600,
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
        totalAmount: 93600,
      },
      minOrderPrice: 30000,
    }),
    // subtotal : 79888, total: 0 (79888 - 79888)
    pg: (): PGPaymentRequestDto => {
      const basePGPaymentRequestDto = new FormData();
      basePGPaymentRequestDto.append(
        'authorizationId',
        EasyPayFixtureUtil.generateAuthorizationId(),
      );
      basePGPaymentRequestDto.append('shopOrderNo', EasyPayFixtureUtil.generateShopOrderNo());
      basePGPaymentRequestDto.append('shopValue1', '테스트 요청사항');
      basePGPaymentRequestDto.append(
        'shopValue2',
        '[{"product":{"id":1,"price":12500},"quantity":3},{"product":{"id":2,"price":16800},"quantity":2},{"product":{"id":3,"price":8788},"quantity":1}]',
      );
      basePGPaymentRequestDto.append('shopValue3', '79888'); // usedPoint
      basePGPaymentRequestDto.append('shopValue4', '1');
      basePGPaymentRequestDto.append('shopValue5', PAYMENTS_METHOD.credit_card);
      basePGPaymentRequestDto.append('shopValue6', '30000');

      return basePGPaymentRequestDto;
    },
  },

  usePoint: {
    // subtotal : 96600, total: 92014 (96600 - 4586)
    bank: (): BankTransferPaymentRequestDto => ({
      user: {
        id: 1,
        deliveryRequest: '테스트 배송요청 사항',
        usedPoint: 4586,
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
        totalAmount: 92014,
      },
      minOrderPrice: 30000,
    }),
    // subtotal : 79888, total: 75302 (79888 - 4586)
    pg: (): PGPaymentRequestDto => {
      const basePGPaymentRequestDto = new FormData();
      basePGPaymentRequestDto.append(
        'authorizationId',
        EasyPayFixtureUtil.generateAuthorizationId(),
      );
      basePGPaymentRequestDto.append('shopOrderNo', EasyPayFixtureUtil.generateShopOrderNo());
      basePGPaymentRequestDto.append('shopValue1', '테스트 요청사항');
      basePGPaymentRequestDto.append(
        'shopValue2',
        '[{"product":{"id":1,"price":12500},"quantity":3},{"product":{"id":2,"price":16800},"quantity":2},{"product":{"id":3,"price":8788},"quantity":1}]',
      );
      basePGPaymentRequestDto.append('shopValue3', '4586'); // usedPoint
      basePGPaymentRequestDto.append('shopValue4', '1');
      basePGPaymentRequestDto.append('shopValue5', PAYMENTS_METHOD.credit_card);
      basePGPaymentRequestDto.append('shopValue6', '30000');

      return basePGPaymentRequestDto;
    },
  },

  zeroUsedPoint: {
    // subtotal : 96600, total: 96600 (96600 - 0)
    bank: (): BankTransferPaymentRequestDto => ({
      user: {
        id: 1,
        deliveryRequest: '테스트 배송요청 사항',
        usedPoint: 0,
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
        totalAmount: 96600,
      },
      minOrderPrice: 30000,
    }),

    // subtotal : 79888, total: 79888 (79888 - 0)
    pg: (): PGPaymentRequestDto => {
      const basePGPaymentRequestDto = new FormData();
      basePGPaymentRequestDto.append(
        'authorizationId',
        EasyPayFixtureUtil.generateAuthorizationId(),
      );
      basePGPaymentRequestDto.append('shopOrderNo', EasyPayFixtureUtil.generateShopOrderNo());
      basePGPaymentRequestDto.append('shopValue1', '테스트 요청사항');
      basePGPaymentRequestDto.append(
        'shopValue2',
        '[{"product":{"id":1,"price":12500},"quantity":3},{"product":{"id":2,"price":16800},"quantity":2},{"product":{"id":3,"price":8788},"quantity":1}]',
      );
      basePGPaymentRequestDto.append('shopValue3', '0'); // usedPoint
      basePGPaymentRequestDto.append('shopValue4', '1');
      basePGPaymentRequestDto.append('shopValue5', PAYMENTS_METHOD.credit_card);
      basePGPaymentRequestDto.append('shopValue6', '30000');

      return basePGPaymentRequestDto;
    },
  },
};
