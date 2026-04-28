import { describe, it, expect, vi } from 'vitest';
import { CartRepository } from '../api/repository';
import { CartService } from './cart.service';
import {
  createCartItemRequestDtoFixture,
  createCartItemFixture,
  createCartFixture,
} from '../__test__/cart.fixture';

describe('CartService', () => {
  describe('createCartItem', () => {
    const saveSpy = vi.spyOn(CartRepository, 'save').mockResolvedValue(undefined);

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
      const CART_ID = 1;
      const service = new CartService();
      await service.getCart(CART_ID);

      expect(findAllSpy).toBeCalled();
      expect(findAllSpy).toBeCalledTimes(1);
    });

    it('유저 아이디가 올바르지 않다면, error를 throw한다', async () => {
      const CART_ID = null;
      const service = new CartService();

      await expect(() => service.getCart(CART_ID as any)).rejects.toThrow();
    });
  });

  describe('updateCart', () => {
    const updateSpy = vi.spyOn(CartRepository, 'updateItem').mockResolvedValue({ id: 1 });

    it('장바구니 데이터를 업데이트 한다', async () => {
      const updateList = [
        createCartItemFixture(),
        createCartItemFixture(),
        createCartItemFixture(),
      ];
      const service = new CartService();
      await service.updateCart(updateList);

      expect(updateSpy).toBeCalledTimes(updateList.length);
    });

    it.todo('Promise all이 reject시에 대한 테스트 케이스를 작성한다');
  });

  describe('deleteCartItem', () => {
    it('장바구니 품목 하나를 삭제한다', async () => {
      const deleteItemSpy = vi.spyOn(CartRepository, 'deleteItem').mockResolvedValue({ id: 1 });
      const TEST_TARGET_ID = 1;

      const service = new CartService();
      await service.deleteCartItem(TEST_TARGET_ID);

      expect(deleteItemSpy).toBeCalledTimes(1);
    });

    it('삭제 실패시 error를 throw한다.', async () => {
      vi.spyOn(CartRepository, 'deleteItem').mockRejectedValue(() => {
        throw new Error('삭제 실패');
      });
      const TEST_TARGET_ID = 1;

      const service = new CartService();
      await expect(() => service.deleteCartItem(TEST_TARGET_ID)).rejects.toThrowError();
    });
  });

  describe('clearCart', () => {
    it('장바구니의 모든 품목을 삭제한다.', async () => {
      vi.spyOn(CartRepository, 'findOne').mockResolvedValue(createCartFixture());
      const deleteAllSpy = vi
        .spyOn(CartRepository, 'deleteAllItem')
        .mockResolvedValue(undefined as any);
      const TEST_CART_ID = 1;

      const service = new CartService();
      await service.clearCart(TEST_CART_ID);

      expect(deleteAllSpy).toBeCalledTimes(1);
    });

    it('삭제 실패시 error를 throw한다', async () => {
      vi.spyOn(CartRepository, 'findOne').mockResolvedValue(createCartFixture());
      vi.spyOn(CartRepository, 'deleteAllItem').mockRejectedValue(() => {
        throw new Error('삭제 실패');
      });
      const TEST_CART_ID = 1;

      const service = new CartService();
      await expect(() => service.clearCart(TEST_CART_ID)).rejects.toThrowError();
    });
  });
});
