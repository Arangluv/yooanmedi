import { describe, it, expect } from 'vitest';
import { PointFeatureFixture } from '../fixtures';
import { PointFeatureMapper } from '../../mapper';
import {
  createPointTransactionSchema,
  pointItemSchema,
  pointItemListSchema,
} from '@/entities/point';
import { updateUserSchema } from '@/entities/user';
import { createProductFixture } from '@/entities/product/__test__';
import { createCartItemFixture } from '@/entities/cart-item/__test__';

describe('PointFeatureMapper', () => {
  describe('refundReqtoDomainRequestDto', () => {
    it('CreatePointHistoryRequestDto를 반환한다', () => {
      // Given
      const dto = PointFeatureFixture.create.refund;
      const amount = 100;

      // When
      const result = PointFeatureMapper.refundReqtoDomainRequestDto(dto, amount);

      // Then
      expect(result).toEqual(expect.schemaMatching(createPointTransactionSchema));
    });
  });

  describe('useageReqtoDomain', () => {
    it('CreatePointHistoryRequestDto를 반환한다', () => {
      // Given
      const dto = PointFeatureFixture.create.usage;

      // When
      const result = PointFeatureMapper.useageReqtoDomain(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(createPointTransactionSchema));
    });
  });

  describe('toUserUpdateDto', () => {
    it('UpdateUserDto를 반환한다', () => {
      // Given
      const dto = PointFeatureFixture.update;
      const amount = 100;

      // When
      const result = PointFeatureMapper.toUserUpdateDto({ ...dto, amount });

      // Then
      expect(result).toEqual(expect.schemaMatching(updateUserSchema));
    });
  });

  describe('productToPointItem', () => {
    it.todo('해당 테스트는 point-list features refactoring 후 이동시켜야합니다');

    it('PointItemDto를 반환한다', () => {
      // Given
      const dto = createProductFixture();
      const quantity = 1;

      // When
      const result = PointFeatureMapper.productToPointItem(dto, quantity);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointItemSchema));
    });
  });

  describe('cartItemListToPointItemList', () => {
    it.todo('해당 테스트는 point-list features refactoring 후 이동시켜야합니다');

    it('PointItemDto를 반환한다', () => {
      // Given
      const dto = [
        createCartItemFixture({ id: 1 }),
        createCartItemFixture({ id: 2 }),
        createCartItemFixture({ id: 3 }),
      ];

      // When
      const result = PointFeatureMapper.cartItemListToPointItemList(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointItemListSchema));
    });
  });
});
