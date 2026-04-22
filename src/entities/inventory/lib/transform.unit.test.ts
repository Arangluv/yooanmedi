import { describe, it, expect, vi, beforeEach, Mock } from 'vitest';
import { transformOrderListToInventory } from './transform';
import { createProductFixture } from '@/shared/__mock__/product.fixture';

vi.mock('@/entities/product', () => ({
  getProductById: vi.fn(),
}));
import { getProductById } from '@/entities/product/api/get-product-by-id';

const mockGetProductById = getProductById;

describe('transformOrderListToInventory', () => {
  beforeEach(() => {
    vi.clearAllMocks(); // 각 테스트 전 mock 초기화
  });

  it('orderList를 inventory entity로 변환한다.', async () => {
    // 1. mock 반환값 설정
    vi.mocked(mockGetProductById)
      .mockResolvedValueOnce(createProductFixture())
      .mockResolvedValueOnce(
        createProductFixture({
          id: 1683,
          name: '부로멜라장용정',
          price: 18000,
          insurance_code: '649801890',
          specification: '100mg/300T',
          manufacturer: '(사용X)명문제약',
          is_best_product: true,
          cashback_rate: 0.5,
          cashback_rate_for_bank: 1.5,
        }),
      );

    // 2. 입력값
    const orderList = [
      { product: { id: 1681, price: 7000 }, quantity: 1 },
      { product: { id: 1683, price: 18000 }, quantity: 1 },
    ];

    // 3. 실행
    const result = await transformOrderListToInventory(orderList);

    // 4. 검증
    expect(result).toHaveLength(2);
    expect(mockGetProductById).toHaveBeenCalledTimes(2);

    expect(result[0].product.id).toBe(1681);
    expect(result[0].product.price).toBe(7000);

    expect(result[1].product.id).toBe(1683);
    expect(result[1].product.price).toBe(18000);
  });

  it('가격은 getProductById의 반환값이 아닌, orderList의 값을 사용한다.', async () => {
    // 1. mock 반환값 설정
    vi.mocked(mockGetProductById).mockResolvedValue(createProductFixture());

    // 2. 입력값
    const orderList = [{ product: { id: 1681, price: 9999 }, quantity: 1 }];

    // 3. 실행
    const result = await transformOrderListToInventory(orderList);

    // 4. 검증
    expect(result[0].product.price).toBe(9999);
  });
});
