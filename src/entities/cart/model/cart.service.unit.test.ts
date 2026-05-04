import { describe, it, expect, vi } from 'vitest';
import { CartService } from './cart.service';
import { CartItemRepository } from '../api/cart-items.repository';
import { CartRepository } from '../api/cart.repository';
import { createCartItemRequestDtoFixture, createCartItemFixture } from '../__test__/cart.fixture';

describe('CartService', () => {
  describe('createCart', () => {
    it('장바구니가 생성된다', async () => {
      const createSpy = vi.spyOn(CartRepository, 'create').mockResolvedValue(undefined);
      const TEST_USER_ID = 1;

      const service = new CartService();
      await service.createCart(TEST_USER_ID);

      expect(createSpy).toBeCalledTimes(1);
    });

    it('Repository에서 create가 실패되면 error를 throw한다', async () => {
      vi.spyOn(CartRepository, 'create').mockRejectedValue(() => {
        throw new Error('장바구니 생성 실패');
      });
      const TEST_USER_ID = 1;

      const service = new CartService();
      await expect(() => service.createCart(TEST_USER_ID)).rejects.toThrowError();
    });

    it('올바르지 않은 User id를 받으면 실패한다', async () => {
      const service = new CartService();
      await expect(() => service.createCart(null as any)).rejects.toThrowError();
    });
  });

  describe('createCartItem', () => {
    const saveSpy = vi.spyOn(CartItemRepository, 'save').mockResolvedValue(null as any);

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

  describe('updateCart', () => {
    const updateList = [
      createCartItemFixture({ id: 1 }),
      createCartItemFixture({ id: 2 }),
      createCartItemFixture({ id: 3 }),
    ];

    it('장바구니 데이터를 업데이트 한다', async () => {
      const updateSpy = vi.spyOn(CartItemRepository, 'update').mockImplementation(async (item) => {
        return { id: item.id };
      });

      const service = new CartService();
      await service.updateCart(updateList);

      expect(updateSpy).toBeCalledTimes(updateList.length);
    });

    it('장바구니를 업데이트 하는데 실패하면 error를 throw한다.', async () => {
      vi.spyOn(CartItemRepository, 'update')
        .mockResolvedValueOnce({ id: 1 })
        .mockResolvedValueOnce({ id: 2 })
        .mockRejectedValueOnce(new Error('update failed'));

      const service = new CartService();
      await expect(() => service.updateCart(updateList)).rejects.toThrow();
    });
  });

  describe('deleteCartItem', () => {
    const targetCartItem = createCartItemFixture();

    it('장바구니 품목 하나를 삭제한다', async () => {
      const deleteItemSpy = vi
        .spyOn(CartItemRepository, 'delete')
        .mockResolvedValue(targetCartItem);

      const service = new CartService();
      await service.deleteCartItem(targetCartItem);

      expect(deleteItemSpy).toBeCalledTimes(1);
    });

    it('삭제 실패시 error를 throw한다.', async () => {
      vi.spyOn(CartItemRepository, 'delete').mockRejectedValue(() => {
        throw new Error('삭제 실패');
      });

      const service = new CartService();
      await expect(() => service.deleteCartItem(targetCartItem)).rejects.toThrowError();
    });
  });

  describe('clearCart', () => {
    vi.spyOn(CartService.prototype, 'getCart').mockResolvedValue({
      items: [{ id: 1 }, { id: 2 }, { id: 3 }],
    } as any);

    it('장바구니의 모든 품목을 삭제한다.', async () => {
      const deleteAllSpy = vi
        .spyOn(CartItemRepository, 'deleteAll')
        .mockResolvedValue(undefined as any);

      const service = new CartService();
      await service.clearCart();

      expect(deleteAllSpy).toBeCalledTimes(1);
    });

    it('삭제 실패시 error를 throw한다', async () => {
      vi.spyOn(CartItemRepository, 'deleteAll').mockRejectedValue(() => {
        throw new Error('삭제 실패');
      });

      const service = new CartService();
      await expect(() => service.clearCart()).rejects.toThrowError();
    });
  });
});
