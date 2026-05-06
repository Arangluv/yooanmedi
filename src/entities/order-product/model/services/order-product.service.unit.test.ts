import { describe, it, expect, vi } from 'vitest';
import { OrderProductService } from './order-product.service';
import { OrderProductRepository } from '../../api/repository';

describe('OrderProductService', () => {
  const service = new OrderProductService();

  describe('getOrderProducts', () => {
    it('order과 관계를 가지는 order-products를 가져온다', async () => {
      vi.spyOn(OrderProductRepository, 'findMany').mockResolvedValue([{ id: 1 } as any]);
      const orderProducts = await service.getOrderProducts(null as any);

      expect(orderProducts).toBeDefined;
    });

    it('order-products가 비어있는 경우 error를 throw한다', async () => {
      vi.spyOn(OrderProductRepository, 'findMany').mockResolvedValue([]);

      await expect(() => service.getOrderProducts(null as any)).rejects.toThrowError();
    });
  });
});
