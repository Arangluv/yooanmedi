import { describe, it, expect } from 'vitest';
import {
  cartItemBaseSchema,
  cartSchema,
  cartItemSchema,
  createCartItemRequestSchema,
  createCartItemEntitySchema,
  toCreateCartItemEntity,
} from './cart.schema';
import {
  createBaseCartItemFixture,
  createCartFixture,
  createCartItemFixture,
  createCartItemRequestDtoFixture,
} from '../__test__/cart.fixture';

describe('cartSchema', () => {
  describe('cartItemBaseSchema', () => {
    const testSchema = cartItemBaseSchema;

    it('파싱에 성공한다', () => {
      const result = testSchema.safeParse(createBaseCartItemFixture());
      expect(result.success).toBe(true);
    });

    it.each([
      {
        caseName: '수량이 0인 경우',
        dto: createBaseCartItemFixture({ quantity: 0 }),
      },
      {
        caseName: '수량이 음수인 경우',
        dto: createBaseCartItemFixture({ quantity: -3 }),
      },
      {
        caseName: '수량이 비어있는 경우',
        dto: createBaseCartItemFixture({ quantity: undefined as any }),
      },
    ])('$caseName -> 파싱에 실패한다', ({ dto }) => {
      const result = testSchema.safeParse(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('cartItemSchema', () => {
    const testSchema = cartItemSchema;

    it('파싱에 성공한다', () => {
      const result = testSchema.safeParse(createCartItemFixture());
      expect(result.success).toBe(true);
    });

    it.each([
      {
        caseName: '잘못된 id타입인 경우',
        entity: createCartItemFixture({ id: '1' } as any),
      },
      {
        caseName: 'id가 비어있는 경우',
        entity: createCartItemFixture({ id: undefined } as any),
      },
      {
        caseName: 'product entity와 일치하지 않은 경우',
        entity: createCartItemFixture({
          product: 1 as any,
        }),
      },
      {
        caseName: 'product가 비어있는 경우',
        entity: createCartItemFixture({
          product: null as any,
        }),
      },
    ])('$caseName -> 파싱에 실패한다', ({ entity }) => {
      const result = testSchema.safeParse(entity);
      expect(result.success).toBe(false);
    });
  });

  describe('cartSchema', () => {
    const testSchema = cartSchema;

    it('파싱에 성공한다', () => {
      const result = testSchema.safeParse(createCartFixture());
      expect(result.success).toBe(true);
    });

    it('아이템이 비어있는 경우도 파싱에 성공한다', () => {
      const result = testSchema.safeParse(createCartFixture({ items: [] }));
      expect(result.success).toBe(true);
    });

    it('유저 아이디 타입이 잘못된 경우 파싱에 실패한다', () => {
      const result = testSchema.safeParse(
        createCartFixture({
          user: {
            id: 1,
            name: '테스트 병원',
          },
        } as any),
      );

      expect(result.success).toBe(false);
    });
  });

  describe('createCartItemRequestSchema', () => {
    const testSchema = createCartItemRequestSchema;

    it('파싱에 성공한다', () => {
      const result = testSchema.safeParse(createCartItemRequestDtoFixture());
      expect(result.success).toBe(true);
    });

    it.each([
      {
        caseName: '잘못된 제품 아이디 타입을 전달한 경우',
        dto: createCartItemRequestDtoFixture({ product: '1' } as any),
      },
      {
        caseName: '제품 아이디가 비어있는 경우',
        dto: createCartItemRequestDtoFixture({ product: '1' } as any),
      },
    ])('$caseName -> 파싱에 실패한다', (dto) => {
      const result = testSchema.safeParse(dto);
      expect(result.success).toBe(false);
    });
  });

  describe('toCreateCartItemEntity', () => {
    it('requestDto를 create Entity로 변환한다', () => {
      const result = toCreateCartItemEntity(createCartItemRequestDtoFixture());
      expect(result).toEqual(expect.schemaMatching(createCartItemEntitySchema));
    });
  });
});
