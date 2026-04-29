import { describe, it, expect, vi } from 'vitest';
import { CartItemRepository } from '../api/cart-items.repository';
import { CartRepository } from '../api/cart.repository';
import { CartService } from './cart.service';
import {
  createCartItemRequestDtoFixture,
  createCartItemFixture,
  createCartFixture,
} from '../__test__/cart.fixture';
import { UserRepository } from '@/entities/user/infrastructure';

describe('CartService', () => {
  describe('createCart', () => {
    it('장바구니가 생성된다', async () => {
      const createSpy = vi.spyOn(CartRepository, 'create').mockResolvedValue(undefined);
      const TEST_USER_ID = 1;

      const service = new CartService();
      await service.createCart(TEST_USER_ID);

      expect(createSpy).toBeCalledTimes(1);
    });

    it('장바구니이 실패하면 error를 throw한다', async () => {
      vi.spyOn(CartRepository, 'create').mockRejectedValue(() => {
        throw new Error('장바구니 생성 실패');
      });
      const TEST_USER_ID = 1;

      const service = new CartService();
      await expect(() => service.createCart(TEST_USER_ID)).rejects.toThrowError();
    });
  });

  describe('createCartItem', () => {
    const saveSpy = vi.spyOn(CartItemRepository, 'save').mockResolvedValue(undefined);

    it('데이터가 올바르게 저장된다', async () => {
      const service = new CartService();
      await service.createCartItem(createCartItemRequestDtoFixture());

      expect(saveSpy).toBeCalled();
      expect(saveSpy).toBeCalledTimes(1);
    });

    it('DTO가 올바르지 않을 시 에러를 throw한다', async () => {
      const service = new CartService();
      await expect(() => service.createCartItem(null as any)).rejects.toThrowError();
    });
  });

  describe('getCart', () => {
    const findAllSpy = vi.spyOn(CartRepository, 'findOne').mockResolvedValue(undefined as any);

    it('데이터를 가져오는데 성공한다', async () => {
      vi.spyOn(UserRepository, 'findByHeader').mockResolvedValue({ id: 3 } as any);
      const service = new CartService();
      await service.getCart();

      expect(findAllSpy).toBeCalled();
      expect(findAllSpy).toBeCalledTimes(1);
    });

    it('유저 아이디가 올바르지 않다면, error를 throw한다', async () => {
      vi.spyOn(UserRepository, 'findByHeader').mockResolvedValue(null as any);
      const service = new CartService();

      await expect(() => service.getCart()).rejects.toThrow();
    });
  });

  describe('updateCart', () => {
    const updateSpy = vi.spyOn(CartItemRepository, 'update').mockResolvedValue({ id: 1 });

    it.todo('장바구니 데이터를 업데이트 한다', async () => {
      const updateList = [
        createCartItemFixture(),
        createCartItemFixture(),
        createCartItemFixture(),
      ];
      const service = new CartService();
      // await service.updateCart(updateList);

      expect(updateSpy).toBeCalledTimes(updateList.length);
    });

    it.todo('Promise all이 reject시에 대한 테스트 케이스를 작성한다');
  });

  describe('deleteCartItem', () => {
    it('장바구니 품목 하나를 삭제한다', async () => {
      const deleteItemSpy = vi.spyOn(CartItemRepository, 'delete').mockResolvedValue({ id: 1 });
      const TEST_TARGET_ID = 1;

      const service = new CartService();
      await service.deleteCartItem(TEST_TARGET_ID);

      expect(deleteItemSpy).toBeCalledTimes(1);
    });

    it('삭제 실패시 error를 throw한다.', async () => {
      vi.spyOn(CartItemRepository, 'delete').mockRejectedValue(() => {
        throw new Error('삭제 실패');
      });
      const TEST_TARGET_ID = 1;

      const service = new CartService();
      await expect(() => service.deleteCartItem(TEST_TARGET_ID)).rejects.toThrowError();
    });
  });

  describe('clearCart', () => {
    it('장바구니의 모든 품목을 삭제한다.', async () => {
      vi.spyOn(UserRepository, 'findByHeader').mockResolvedValue({ id: 3 } as any);
      vi.spyOn(CartRepository, 'findOne').mockResolvedValue(createCartFixture());
      const deleteAllSpy = vi
        .spyOn(CartItemRepository, 'deleteAll')
        .mockResolvedValue(undefined as any);

      const service = new CartService();
      await service.clearCart();

      expect(deleteAllSpy).toBeCalledTimes(1);
    });

    it('삭제 실패시 error를 throw한다', async () => {
      vi.spyOn(UserRepository, 'findByHeader').mockResolvedValue(undefined as any);
      vi.spyOn(CartRepository, 'findOne').mockResolvedValue(createCartFixture());
      vi.spyOn(CartItemRepository, 'deleteAll').mockRejectedValue(() => {
        throw new Error('삭제 실패');
      });

      const service = new CartService();
      await expect(() => service.clearCart()).rejects.toThrowError();
    });
  });
});
