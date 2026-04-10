import { describe, it, expect } from 'vitest';
import { generateShopOrderNo } from '../order-uuid';

describe('order-uuid', () => {
  it('generateShopOrderNo를 호출하면 주문 번호를 반환한다', () => {
    const orderNo = generateShopOrderNo();
    expect(orderNo).toBeDefined();
  });

  it('generateShopOrderNo를 호출하면 주문 번호의 길이가 15자리인지 확인한다', () => {
    const orderNo = generateShopOrderNo();
    expect(orderNo.length).toBe(15);
  });
});
