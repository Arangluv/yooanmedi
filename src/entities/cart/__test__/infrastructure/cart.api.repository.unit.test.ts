import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockCartAdapter } from '../mocks';
import { createCartEntityFixture } from '../fixtures';
import { CreateCartDto } from '../../dto';
import { CartAdapter, CartApiRepository } from '../../infrastructure';

describe('Cart Api Repository', () => {
  let mockAdapter: ReturnType<typeof CartAdapter>;
  let repository: CartApiRepository;

  beforeEach(() => {
    mockAdapter = MockCartAdapter();
    repository = new CartApiRepository(mockAdapter);
  });

  describe('create', () => {
    it('장바구니 생성에 성공한다', async () => {
      // Given
      const dto = {
        user: 3,
      } as CreateCartDto;
      vi.mocked(mockAdapter.createCart).mockResolvedValue(
        PayloadAdapterResultManager.ok(createCartEntityFixture({ cartItems: undefined })),
      );

      // When
      await repository.create(dto);

      // Then
      expect(mockAdapter.createCart).toHaveBeenCalledTimes(1);
      expect(mockAdapter.createCart).toHaveBeenCalledWith(dto);
    });

    it('장바구니 생성에 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        user: 3,
      } as CreateCartDto;
      vi.mocked(mockAdapter.createCart).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.create(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('findOneByUserId', () => {
    it('유저 아이디를 통해 장바구니 조회에 성공한다', async () => {
      // Given
      const userId = 3;
      vi.mocked(mockAdapter.getCartByUserId).mockResolvedValue(
        PayloadAdapterResultManager.ok(createCartEntityFixture()),
      );

      // When
      const result = await repository.findOneByUserId(userId);

      // Then
      expect(mockAdapter.getCartByUserId).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getCartByUserId).toHaveBeenCalledWith(userId);
      expect(result).not.instanceOf(Array);
    });

    it('유저 아이디를 통해 장바구니 조회 실패 시 BaseError를 throw한다', async () => {
      // Given
      const userId = 3;
      vi.mocked(mockAdapter.getCartByUserId).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.findOneByUserId(userId)).rejects.toThrow(BaseError);
    });
  });
});
