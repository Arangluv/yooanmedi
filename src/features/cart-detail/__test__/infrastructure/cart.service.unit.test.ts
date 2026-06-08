import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError } from '@/shared';
import { CartRepositoryMocks } from '@/entities/cartv2/__test__';
import {
  CartItemRepositoryMocks,
  createCartItemEntityFixture,
} from '@/entities/cart-item/__test__';
import {
  createCustomPriceEntityFixture,
  CustomPriceRepositoryMocks,
} from '@/entities/custom-price/__test__';
import { createProductFixture } from '@/entities/product/__test__';
import { UserRepositoryMocks } from '@/entities/user/__test__';
import { CreateCartItemDto, cartItemSchema, cartItemsSchema } from '@/entities/cart-item';
import { createCartDetailItemFixture } from '../fixtures';
import { CartDetailService, CartDetailServiceDependencies } from '../../infrastructure/services';
import { DeleteCartDetailItemRequestDto, SaveCartDetailRequestDto } from '../../dto';
import { cartDetailSchema } from '../../schemas';

describe('CartDetail Service', () => {
  describe('Success Cases', () => {
    let useCases: ReturnType<typeof CartDetailService>;
    let dependencies: CartDetailServiceDependencies;

    beforeEach(() => {
      const cartRepository = CartRepositoryMocks.createSuccess();
      const cartItemRepository = CartItemRepositoryMocks.createSuccess();
      const customPriceRepository = CustomPriceRepositoryMocks.createSuccess();
      const userRepository = UserRepositoryMocks.createSuccess();

      dependencies = {
        repository: {
          cart: cartRepository,
          cartItem: cartItemRepository,
          customPrice: customPriceRepository,
          user: userRepository,
        },
      } as unknown as CartDetailServiceDependencies;
      useCases = CartDetailService(dependencies);
    });

    it('[getCart] 장바구니 조회에 성공한다', async () => {
      // Given
      const cartRepository = CartRepositoryMocks.createSuccess();
      const userRepository = UserRepositoryMocks.createSuccess();
      const cartItemRepository = CartItemRepositoryMocks.create();
      const customPriceRepository = CustomPriceRepositoryMocks.create();
      vi.mocked(cartItemRepository.findMany).mockResolvedValue([
        createCartItemEntityFixture({
          product: createProductFixture({ id: 3 }) as any,
        }),
      ]);
      vi.mocked(customPriceRepository.findMany).mockResolvedValue([
        createCustomPriceEntityFixture({ product: 3 }),
      ]);

      const dependencies = {
        repository: {
          cart: cartRepository,
          cartItem: cartItemRepository,
          customPrice: customPriceRepository,
          user: userRepository,
        },
      } as unknown as CartDetailServiceDependencies;
      const useCases = CartDetailService(dependencies);

      // When
      const result = await useCases.getCart();

      // Then
      expect(result).toEqual(expect.schemaMatching(cartDetailSchema));
    });

    it('[addToCart] 장바구니에 상품을 담는데 성공한다', async () => {
      // Given
      const dto = { carts: 1, product: 3, quantity: 8 } as CreateCartItemDto;

      // When
      const result = await useCases.addToCart(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(cartItemSchema));
    });

    it('[saveCartChanges] 장바구니 아이템 수량변경에 성공한다', async () => {
      // Given
      const dto = [
        createCartDetailItemFixture({ id: 1 }),
        createCartDetailItemFixture({ id: 2 }),
      ] as SaveCartDetailRequestDto;

      // When
      const result = await useCases.saveCartChanges(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(cartItemsSchema));
      expect(result).toBeInstanceOf(Array);
    });

    it('[deleteFromCart] 장바구니 아이템 삭제에 성공한다', async () => {
      // Given
      const dto = createCartDetailItemFixture() as DeleteCartDetailItemRequestDto;

      // When
      const result = await useCases.deleteFromCart(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(cartItemSchema));
    });

    it('[clearCart] 장바구니를 비우는데 성공한다', async () => {
      // Given
      const cartId = 3;

      // When
      const result = await useCases.clearCart(cartId);

      // Then
      expect(result).toBeInstanceOf(Array);
      expect(result).toEqual(expect.schemaMatching(cartItemsSchema));
    });
  });

  describe('Fail Cases', () => {
    let useCases: ReturnType<typeof CartDetailService>;
    let dependencies: CartDetailServiceDependencies;

    beforeEach(() => {
      const cartRepository = CartRepositoryMocks.createError();
      const cartItemRepository = CartItemRepositoryMocks.createError();
      const customPriceRepository = CustomPriceRepositoryMocks.createError();
      const userRepository = UserRepositoryMocks.createError();

      dependencies = {
        repository: {
          cart: cartRepository,
          cartItem: cartItemRepository,
          customPrice: customPriceRepository,
          user: userRepository,
        },
      } as unknown as CartDetailServiceDependencies;
      useCases = CartDetailService(dependencies);
    });

    it('[getCart] 장바구니 조회에 실패 시 BaseError를 throw한다', async () => {
      // When & Then
      await expect(() => useCases.getCart()).rejects.toThrow(BaseError);
    });

    it('[addToCart] 장바구니에 상품을 담는데 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = { carts: 1, product: 3, quantity: 8 } as CreateCartItemDto;

      // When & Then
      await expect(() => useCases.addToCart(dto)).rejects.toThrow(BaseError);
    });

    it('[saveCartChanges] 장바구니 아이템 수량변경에 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = [
        createCartDetailItemFixture({ id: 1 }),
        createCartDetailItemFixture({ id: 2 }),
      ] as SaveCartDetailRequestDto;

      // When & Then
      await expect(() => useCases.saveCartChanges(dto)).rejects.toThrow(BaseError);
    });

    it('[deleteFromCart] 장바구니 아이템 삭제 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = createCartDetailItemFixture() as DeleteCartDetailItemRequestDto;

      // When & Then
      await expect(() => useCases.deleteFromCart(dto)).rejects.toThrow(BaseError);
    });

    it('[clearCart] 장바구니를 비우는데 실패 시 BaseError를 throw한다', async () => {
      // Given
      const cartId = 3;
      // When & Then
      await expect(() => useCases.clearCart(cartId)).rejects.toThrow(BaseError);
    });
  });
});
