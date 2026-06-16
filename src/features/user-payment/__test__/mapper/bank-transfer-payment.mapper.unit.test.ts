import { describe, it, expect } from 'vitest';
import { priceItemListSchema } from '@/shared';
import { createCreatedOrderFixture } from '@/entities/order/__test__';
import { createOrderSchemaForBankTransfer } from '@/entities/order';
import { createOrderProductSchema } from '@/entities/order-product';
import { createPurchasedHistoryRequestSchema } from '@/entities/purchased-history';
import { CreatePointSchema } from '@/entities/point';
import { updateUserSchema } from '@/entities/user';
import { createOrderProductFixture } from '@/entities/order-product/__test__';
import { createCartItemFixture } from '@/entities/cart-item/__test__';
import { createPointHistoryFixture } from '@/entities/point/__test__';
import { createUserFixture } from '@/entities/user/__test__';
import { BankTransferPaymentMapper } from '../../mapper';
import { PaymentFixtures, createPaymentOrderItemDto } from '../fixtures';

describe('BankTransferPaymentMapper', () => {
  describe('toCreateOrderDto', () => {
    it('createOrderDto로 파싱된다', () => {
      // Given
      const dto = PaymentFixtures.commandDto.bank;

      // When
      const result = BankTransferPaymentMapper.toCreateOrderDto(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(createOrderSchemaForBankTransfer));
    });
  });

  describe('toCreateOrderProductDto', () => {
    it('CreateOrderProductRequestDto로 파싱된다', () => {
      // Given
      const order = createCreatedOrderFixture();
      const orderItem = createPaymentOrderItemDto();

      // When
      const result = BankTransferPaymentMapper.toCreateOrderProductDto(order, orderItem);

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
      const result = BankTransferPaymentMapper.toPurchasedHistoryDto(userId, orderItem);

      // Then
      expect(result).toEqual(expect.schemaMatching(createPurchasedHistoryRequestSchema));
    });
  });

  describe('toCreateUsePointHistoryDto', () => {
    it('CreateUsagePointHistoryRequestDto로 파싱된다', () => {
      // Given
      const commandDto = PaymentFixtures.commandDto.bank;
      const orderItem = createPaymentOrderItemDto();
      const orderProduct = createOrderProductFixture();

      // When
      const result = BankTransferPaymentMapper.toCreateUsePointHistoryDto({
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
        createPointHistoryFixture({ id: 1 }),
        createPointHistoryFixture({ id: 2 }),
        createPointHistoryFixture({ id: 3 }),
      ];

      // When
      const result = BankTransferPaymentMapper.toUpdateUserPointDtoForUse({ user, histories });

      // Then
      expect(result).toEqual(expect.schemaMatching(updateUserSchema));
    });
  });

  describe('toPriceItems', () => {
    it('PriceItemDtoList로 파싱된다', () => {
      // Given
      const cartItems = [
        createCartItemFixture({ id: 1 }),
        createCartItemFixture({ id: 2 }),
        createCartItemFixture({ id: 3 }),
      ];

      // When
      const result = BankTransferPaymentMapper.toPriceItems(cartItems);

      // Then
      expect(result).toEqual(expect.schemaMatching(priceItemListSchema));
    });
  });
});
