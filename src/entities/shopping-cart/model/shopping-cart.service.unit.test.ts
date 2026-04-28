import { describe, it, expect, vi } from 'vitest';
import { ShoppingCartRepository } from '../api/repository';
import { ShoppingCartService } from './shopping-cart.service';

describe('ShoppingCartService', () => {
  describe('createShoppingCartItem', () => {
    const saveSpy = vi.spyOn(ShoppingCartRepository, 'save').mockResolvedValue(undefined);

    it('데이터가 올바르게 저장된다', async () => {
      const dto = {
        user: 1,
        product: 3,
        quantity: 4,
      };
      const service = new ShoppingCartService();
      await service.createShoppingCartItem(dto);

      expect(saveSpy).toBeCalled();
      expect(saveSpy).toBeCalledTimes(1);
      expect(saveSpy).toBeCalledWith(dto);
    });

    it('DTO가 올바르지 않을 시 에러를 throw한다', async () => {
      const service = new ShoppingCartService();
      await expect(() => service.createShoppingCartItem(null as any)).rejects.toThrowError();
    });
  });

  describe('getShoppingCart', () => {
    const findAllSpy = vi.spyOn(ShoppingCartRepository, 'findAll').mockResolvedValue([]);

    it('데이터를 가져오는데 성공한다', async () => {
      const USER_ID = 1;
      const service = new ShoppingCartService();
      const result = await service.getShoppingCart(USER_ID);

      expect(findAllSpy).toBeCalled();
      expect(findAllSpy).toBeCalledTimes(1);
      expect(result).toBeDefined();
    });

    it('유저 아이디가 올바르지 않다면, error를 throw한다', async () => {
      const USER_ID = null;
      const service = new ShoppingCartService();

      await expect(() => service.getShoppingCart(USER_ID as any)).rejects.toThrow();
    });
  });
});
