import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PayloadAdapterResultManager } from '@/shared/server';
import { createCartItemEntityFixture } from '../fixtures';
import { CartItemAdapter, CartItemApiRepository } from '../../infrastructure';
import { CreateCartItemDto, UpdateCartItemRequestDto } from '../../dto';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { MockCartItemAdapter } from '../mocks';

describe('CartItem Api Repository', () => {
  let mockAdapter: ReturnType<typeof CartItemAdapter>;
  let repository: CartItemApiRepository;

  beforeEach(() => {
    mockAdapter = MockCartItemAdapter();
    repository = new CartItemApiRepository(mockAdapter);
  });

  describe('create', () => {
    it('장바구니 아이템 생성에 성공한다', async () => {
      // Given
      const dto = { carts: 8, product: 1683, quantity: 1 } as CreateCartItemDto;
      vi.mocked(mockAdapter.createCartItem).mockResolvedValue(
        PayloadAdapterResultManager.ok(createCartItemEntityFixture()),
      );

      // When
      await repository.create(dto);

      // Then
      expect(mockAdapter.createCartItem).toHaveBeenCalledTimes(1);
      expect(mockAdapter.createCartItem).toHaveBeenCalledWith(dto);
    });

    it('장바구니 아이템 생성에 실패 시 BaseError를 Throw한다', async () => {
      // Given
      const dto = { carts: 8, product: 1683, quantity: 1 } as CreateCartItemDto;
      vi.mocked(mockAdapter.createCartItem).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.create(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('findMany', () => {
    it('장바구니 아이템 조회에 성공한다', async () => {
      // Given
      const option = { pagination: false, limit: 4 } as FindOption;
      vi.mocked(mockAdapter.getCartItems).mockResolvedValue(
        PayloadAdapterResultManager.ok([
          createCartItemEntityFixture({ id: 1 }),
          createCartItemEntityFixture({ id: 2 }),
          createCartItemEntityFixture({ id: 3 }),
        ]),
      );

      // When
      const result = await repository.findMany(option);

      // Then
      expect(mockAdapter.getCartItems).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getCartItems).toHaveBeenCalledWith(option);
      expect(result.length).toBe(3);
    });

    it('장바구니 아이템 조회 실패 시 BaseError를 Throw한다', async () => {
      // Given
      const option = { pagination: false, limit: 4 } as FindOption;
      vi.mocked(mockAdapter.getCartItems).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.findMany(option)).rejects.toThrow(BaseError);
    });
  });

  describe('update', () => {
    it('장바구니 아이템 업데이트에 성공한다', async () => {
      // Given
      const dto = { cartItem: 3, data: { quantity: 3 } } as UpdateCartItemRequestDto;
      vi.mocked(mockAdapter.updateCartItem).mockResolvedValue(
        PayloadAdapterResultManager.ok(createCartItemEntityFixture()),
      );

      // When
      await repository.update(dto);

      // Then
      expect(mockAdapter.updateCartItem).toHaveBeenCalledTimes(1);
      expect(mockAdapter.updateCartItem).toHaveBeenCalledWith(dto);
    });

    it('장바구니 아이템 업데이트 실패 시 BaseError를 Throw한다', async () => {
      // Given
      const dto = { cartItem: 3, data: { quantity: 3 } } as UpdateCartItemRequestDto;
      vi.mocked(mockAdapter.updateCartItem).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.update(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('delete', () => {
    it('장바구니 아이템 삭제에 성공한다', async () => {
      // Given
      const targetId = 3;
      vi.mocked(mockAdapter.deleteCartItem).mockResolvedValue(
        PayloadAdapterResultManager.ok(createCartItemEntityFixture()),
      );

      // When
      await repository.delete(targetId);

      // Then
      expect(mockAdapter.deleteCartItem).toHaveBeenCalledTimes(1);
      expect(mockAdapter.deleteCartItem).toHaveBeenCalledWith(targetId);
    });

    it('장바구니 아이템 삭제 실패 시 BaseError를 Throw한다', async () => {
      // Given
      const targetId = 3;
      vi.mocked(mockAdapter.deleteCartItem).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.delete(targetId)).rejects.toThrow(BaseError);
    });
  });

  describe('deleteMany', () => {
    it('복수의 장바구니 아이템 삭제에 성공한다', async () => {
      // Given
      const targetIds = [1, 2, 3];
      vi.mocked(mockAdapter.deleteManyCartItem).mockResolvedValue(
        PayloadAdapterResultManager.ok([
          createCartItemEntityFixture({ id: 1 }),
          createCartItemEntityFixture({ id: 2 }),
          createCartItemEntityFixture({ id: 3 }),
        ]),
      );

      // When
      await repository.deleteMany(targetIds);

      // Then
      expect(mockAdapter.deleteManyCartItem).toHaveBeenCalledTimes(1);
      expect(mockAdapter.deleteManyCartItem).toHaveBeenCalledWith(targetIds);
    });

    it('복수의 장바구니 아이템 삭제 실패 시 BaseError를 Throw한다', async () => {
      // Given
      const targetIds = [1, 2, 3];
      vi.mocked(mockAdapter.deleteManyCartItem).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.deleteMany(targetIds)).rejects.toThrow(BaseError);
    });
  });
});
