import { describe, it, expect } from 'vitest';
import { shoppingCartItemSchema } from './shopping-cart.schema';

describe('shoppingCartSchema', () => {
  describe('createShoppingCartItemSchema', () => {
    it('파싱에 성공한다', () => {
      const result = shoppingCartItemSchema.safeParse({
        user: 1,
        product: 1321,
        quantity: 3,
      });
      expect(result.success).toBe(true);
    });

    it('수량이 0이면 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse({
        user: 1,
        product: 1322,
        quantity: 0,
      });
      expect(result.success).toBe(false);
    });

    it('수량이 음수면 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse({
        user: 1,
        product: 1322,
        quantity: -3,
      });
      expect(result.success).toBe(false);
    });

    it('수량이 음수면 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse({
        user: 1,
        product: 1322,
        quantity: -3,
      });
      expect(result.success).toBe(false);
    });

    it('잘못된 타입의 유저 아이디를 전달하면 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse({
        user: '1',
        product: 1322,
        quantity: -3,
      });
      expect(result.success).toBe(false);
    });

    it('잘못된 타입의 제품 아이디를 전달하면 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse({
        user: 1,
        product: '1322',
        quantity: -3,
      });
      expect(result.success).toBe(false);
    });

    it('undefined를 전달 시 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });

  describe('create', () => {
    it.todo('');
  });

  describe('create', () => {
    it.todo('');
  });

  describe('create', () => {
    it.todo('');
  });
});
