import { describe, it, expect } from 'vitest';
import { priceItemListSchema } from '@/shared';
import { createOrderSchemaForPG } from '@/entities/order';
import { createOrderProductSchema } from '@/entities/order-product';
import { createPurchasedHistoryRequestSchema } from '@/entities/purchased-history';
import { CreatePointSchema, pointItemSchema } from '@/entities/point';
import { updateUserSchema } from '@/entities/user';
import { EasyPayPaymentApprovalSchemas } from '@/entities/easypay';
import { createPaymentHistorySchema } from '@/entities/payment';
import { EasyPayFixtures } from '@/entities/easypay/__test__';
import { createCreatedOrderFixture } from '@/entities/order/__test__';
import { createOrderProductFixture } from '@/entities/order-product/__test__';
import { createPointHistoryFixture, createPointItemFixture } from '@/entities/point/__test__';
import { createUserFixture } from '@/entities/user/__test__';
import { createProductFixture } from '@/entities/product/__test__';
import { PGPaymentMapper } from '../../mapper';
import { PaymentFixtures, createPaymentOrderItemDto } from '../fixtures';

describe('PGPaymentMapper', () => {
  describe('toCreateOrderDto', () => {
    it('createOrderDto로 파싱된다', () => {
      // Given
      const commnadDto = PaymentFixtures.commandDto.pg;

      // When
      const result = PGPaymentMapper.toCreateOrderDto(commnadDto);

      // Then
      expect(result).toEqual(expect.schemaMatching(createOrderSchemaForPG));
    });
  });

  describe('toCreateOrderProductDto', () => {
    it('CreateOrderProductRequestDto로 파싱된다', () => {
      // Given
      const order = createCreatedOrderFixture();
      const orderItem = createPaymentOrderItemDto();

      // When
      const result = PGPaymentMapper.toCreateOrderProductDto(order, orderItem);

      // Then
      expect(result).toEqual(expect.schemaMatching(createOrderProductSchema));
    });
  });

  describe('toCreateOrderProductDto', () => {
    it('CreatePurchasedHistoryRequestDto로 파싱된다', () => {
      // Given
      const userId = 3;
      const orderItem = createPaymentOrderItemDto();

      // When
      const result = PGPaymentMapper.toPurchasedHistoryDto(userId, orderItem);

      // Then
      expect(result).toEqual(expect.schemaMatching(createPurchasedHistoryRequestSchema));
    });
  });

  describe('orderItemtoPointItem', () => {
    it('pointItem으로 파싱된다', () => {
      // Given
      const orderItem = createPaymentOrderItemDto();

      // When
      const result = PGPaymentMapper.orderItemtoPointItem(orderItem);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointItemSchema));
    });
  });

  describe('toCreateEarnPointHistoryDto', () => {
    it('CreateUsagePointHistoryRequestDto로 파싱된다', () => {
      // Given
      const commandDto = PaymentFixtures.commandDto.pg;
      const pointItem = createPointItemFixture();
      const orderProduct = createOrderProductFixture();

      // When
      const result = PGPaymentMapper.toCreateEarnPointHistoryDto({
        dto: commandDto,
        pointItem,
        orderProduct,
      });

      // Then
      expect(result).toEqual(expect.schemaMatching(CreatePointSchema.usage.request));
    });
  });

  describe('toCreateUsePointHistoryDto', () => {
    it('CreateUsagePointHistoryRequestDto로 파싱된다', () => {
      // Given
      const commandDto = PaymentFixtures.commandDto.pg;
      const orderItem = createPaymentOrderItemDto();
      const orderProduct = createOrderProductFixture();

      // When
      const result = PGPaymentMapper.toCreateUsePointHistoryDto({
        dto: commandDto,
        orderItem,
        orderProduct,
      });

      // Then
      expect(result).toEqual(expect.schemaMatching(CreatePointSchema.usage.request));
    });
  });

  describe('toUpdateUserPointDtoForUse', () => {
    it('UpdateUserDto로 파싱된다', () => {
      // Given
      const user = createUserFixture();
      const histories = [
        createPointHistoryFixture({ id: 1, type: 'USE', amount: 10 }),
        createPointHistoryFixture({ id: 2, type: 'USE', amount: 20 }),
        createPointHistoryFixture({ id: 3, type: 'USE', amount: 30 }),
      ];

      // When
      const result = PGPaymentMapper.toUpdateUserPointDtoForUse({ user, histories });

      // Then
      expect(result).toEqual(expect.schemaMatching(updateUserSchema));
      expect(result.data.point).toBe(user.point - 60);
    });
  });

  describe('toUpdateUserPointDtoForEarn', () => {
    it('UpdateUserDto로 파싱된다', () => {
      // Given
      const user = createUserFixture();
      const histories = [
        createPointHistoryFixture({ id: 1, type: 'EARN', amount: 10 }),
        createPointHistoryFixture({ id: 2, type: 'EARN', amount: 20 }),
        createPointHistoryFixture({ id: 3, type: 'EARN', amount: 30 }),
      ];

      // When
      const result = PGPaymentMapper.toUpdateUserPointDtoForEarn({ user, histories });

      // Then
      expect(result).toEqual(expect.schemaMatching(updateUserSchema));
      expect(result.data.point).toBe(user.point + 60);
    });
  });

  describe('toApprovePaymentDto', () => {
    it('EasyPayApprovePaymentRequestDto로 파싱된다', () => {
      // Given
      const commandDto = PaymentFixtures.commandDto.pg;

      // When
      const result = PGPaymentMapper.toApprovePaymentDto(commandDto);

      // Then
      expect(result).toEqual(expect.schemaMatching(EasyPayPaymentApprovalSchemas.requestDto));
    });
  });

  describe('toCreatePaymentHistoryDto', () => {
    it('CreatePaymentHistoryRequestDto로 파싱된다', () => {
      // Given
      const order = createCreatedOrderFixture();
      const approvalResult = EasyPayFixtures.result.approve;

      // When
      const result = PGPaymentMapper.toCreatePaymentHistoryDto({ order, approvalResult });

      // Then
      expect(result).toEqual(expect.schemaMatching(createPaymentHistorySchema));
    });
  });

  describe('toPriceItems', () => {
    it('PriceItemDtoList로 파싱된다', () => {
      // Given
      const products = [
        {
          product: createProductFixture({ id: 1 }),
          quantity: 3,
        },
        {
          product: createProductFixture({ id: 2 }),
          quantity: 2,
        },
      ];

      // When
      const result = PGPaymentMapper.toPrcieItems(products);

      // Then
      expect(result).toEqual(expect.schemaMatching(priceItemListSchema));
    });
  });
});
