import { describe, it, expect } from 'vitest';
import { shoppingCartItemSchema, shoppingCartSchema } from './shopping-cart.schema';
import { createShoppingCartItemFixture } from '../__test__/shopping-cart.fixture';

describe('shoppingCartSchema', () => {
  describe('createShoppingCartItemSchema', () => {
    it('파싱에 성공한다', () => {
      const result = shoppingCartItemSchema.safeParse(createShoppingCartItemFixture());
      expect(result.success).toBe(true);
    });

    it('수량이 0이면 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse(
        createShoppingCartItemFixture({ quantity: 0 }),
      );
      expect(result.success).toBe(false);
    });

    it('수량이 음수면 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse(
        createShoppingCartItemFixture({ quantity: -3 }),
      );
      expect(result.success).toBe(false);
    });

    it('잘못된 타입의 유저 아이디를 전달하면 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse(
        createShoppingCartItemFixture({
          user: '1',
        } as any),
      );
      expect(result.success).toBe(false);
    });

    it('잘못된 타입의 제품 아이디를 전달하면 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse(
        createShoppingCartItemFixture({
          product: '1',
        } as any),
      );
      expect(result.success).toBe(false);
    });

    it('undefined를 전달 시 파싱에 실패한다', () => {
      const result = shoppingCartItemSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });

  describe('ShoppingCartSchema', () => {
    it('파싱에 성공한다', () => {
      const result = shoppingCartSchema.safeParse([
        createShoppingCartItemFixture(),
        createShoppingCartItemFixture(),
      ]);
      expect(result.success).toBe(true);
    });

    it('빈 배열도 파싱에 성공한다', () => {
      const result = shoppingCartSchema.safeParse([]);
      expect(result.success).toBe(true);
    });

    it('파싱에 실패한다', () => {
      const result = shoppingCartSchema.safeParse([
        createShoppingCartItemFixture({
          user: '1',
        } as any),
        createShoppingCartItemFixture(),
      ]);
      expect(result.success).toBe(false);
    });
  });
});
