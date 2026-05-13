import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrderProductService } from './order-product.service';
import { OrderProductRepository } from '../../api/repository';
import { OrderProductFindOption } from '../../lib/find-options';
import { ORDER_PRODUCT_STATUS } from '../../constants/order-product-status';
import { createOrderProductFixture } from '../../__test__/order-product.fixture';

describe('OrderProductService', () => {
  const service = new OrderProductService();

  describe('getOrderProducts', () => {
    it('order과 관계를 가지는 order-products를 가져온다', async () => {
      vi.spyOn(OrderProductRepository, 'findMany').mockResolvedValue([{ id: 1 } as any]);

      const findOptions = OrderProductFindOption.orderTransition.build({
        orderId: 1,
        currentStatus: ORDER_PRODUCT_STATUS.pending,
      });
      const orderProducts = await service.getOrderProducts(findOptions);

      expect(orderProducts).toBeDefined;
    });

    it('order-products가 비어있는 경우 error를 throw한다', async () => {
      vi.spyOn(OrderProductRepository, 'findMany').mockResolvedValue([]);
      const findOptions = OrderProductFindOption.orderTransition.build({
        orderId: 1,
        currentStatus: ORDER_PRODUCT_STATUS.pending,
      });

      await expect(() => service.getOrderProducts(findOptions)).rejects.toThrowError();
    });
  });

  describe('updateOrderProducts', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('1개 이상의 orderProduct를 업데이트 한다', async () => {
      const updateManySpy = vi
        .spyOn(OrderProductRepository, 'updateMany')
        .mockResolvedValue(undefined);

      const TEST_ORDER_PRODUCTS = [createOrderProductFixture(), createOrderProductFixture()];
      const TEST_UPDATE_DATA = { orderProductStatus: ORDER_PRODUCT_STATUS.preparing };

      await service.updateOrderProducts(TEST_ORDER_PRODUCTS, TEST_UPDATE_DATA);

      expect(updateManySpy).toHaveBeenCalled();
      expect(updateManySpy).toHaveBeenCalledTimes(1);
    });

    it('수정할 수 없는 필드를 수정하려고 하면 빈객체가 전달되어 업데이트가 진행되지 않는다.', async () => {
      const updateManySpy = vi
        .spyOn(OrderProductRepository, 'updateMany')
        .mockResolvedValue(undefined);

      const TEST_ORDER_PRODUCTS = [createOrderProductFixture(), createOrderProductFixture()];
      const TEST_UPDATE_DATA = { quantity: 12 } as any;
      const targetIds = TEST_ORDER_PRODUCTS.map((orderProduct) => orderProduct.id);

      await service.updateOrderProducts(TEST_ORDER_PRODUCTS, TEST_UPDATE_DATA);

      expect(updateManySpy).toHaveBeenCalled();
      expect(updateManySpy).toHaveBeenCalledTimes(1);
      expect(updateManySpy).toHaveBeenCalledWith(targetIds, {});
    });
  });
});
