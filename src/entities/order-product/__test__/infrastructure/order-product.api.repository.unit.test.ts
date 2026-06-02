import { describe, it, beforeEach, expect, vi } from 'vitest';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockOrderProductAdapter } from '../mocks';
import { createOrderProductFixture } from '../fixtures';
import { OrderProductApiRepository } from '../../infrastructure/repository';
import { OrderProductAdapter } from '../../infrastructure/api';
import {
  BulkUpdateOrderProductRequestDto,
  CreateOrderProductRequestDto,
  UpdateOrderProductRequestDto,
} from '../../dto';
import { orderProductSchema, orderProductsSchema } from '../../schemas';

describe('OrderProduct Api Repository', () => {
  let mockOrderProductAdapter: ReturnType<typeof OrderProductAdapter>;
  let orderProductApiRepository: OrderProductApiRepository;

  beforeEach(() => {
    mockOrderProductAdapter = MockOrderProductAdapter();
    orderProductApiRepository = new OrderProductApiRepository(mockOrderProductAdapter);

    vi.clearAllMocks();
  });

  describe('create', () => {
    it('주문상품 생성에 성공한다', async () => {
      // Given
      const dto = {
        product: 1675,
        order: 879,
        orderProductStatus: 'pending',
        productNameSnapshot: '메디락에스산',
        priceSnapshot: 2000,
        totalAmount: 2000,
        productDeliveryFee: 0,
        quantity: 1,
        cashback_rate: 0.5,
        cashback_rate_for_bank: 1.5,
      } as CreateOrderProductRequestDto;
      vi.mocked(mockOrderProductAdapter.createOrderProduct).mockResolvedValue(
        PayloadAdapterResultManager.ok(createOrderProductFixture()),
      );

      // When
      const result = await orderProductApiRepository.create(dto);

      // Then
      expect(mockOrderProductAdapter.createOrderProduct).toHaveBeenCalledTimes(1);
      expect(mockOrderProductAdapter.createOrderProduct).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.schemaMatching(orderProductSchema));
    });

    it('주문상품 생성 실패시 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        product: 1675,
        order: 879,
        orderProductStatus: 'pending',
        productNameSnapshot: '메디락에스산',
        priceSnapshot: 2000,
        totalAmount: 2000,
        productDeliveryFee: 0,
        quantity: 1,
        cashback_rate: 0.5,
        cashback_rate_for_bank: 1.5,
      } as CreateOrderProductRequestDto;
      vi.mocked(mockOrderProductAdapter.createOrderProduct).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => orderProductApiRepository.create(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('findById', () => {
    it('주문상품 조회에 성공한다', async () => {
      // Given
      const orderProductId = 3;
      vi.mocked(mockOrderProductAdapter.getOrderProductById).mockResolvedValue(
        PayloadAdapterResultManager.ok(createOrderProductFixture()),
      );

      // When
      const result = await orderProductApiRepository.findById(orderProductId);

      // Then
      expect(mockOrderProductAdapter.getOrderProductById).toHaveBeenCalledTimes(1);
      expect(mockOrderProductAdapter.getOrderProductById).toHaveBeenCalledWith(orderProductId);
      expect(result).toEqual(expect.schemaMatching(orderProductSchema));
    });

    it('주문상품 조회 실패시 BaseError를 throw한다', async () => {
      // Given
      const orderProductId = 3;
      vi.mocked(mockOrderProductAdapter.getOrderProductById).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => orderProductApiRepository.findById(orderProductId)).rejects.toThrow(BaseError);
    });
  });

  describe('findMany', () => {
    it('주문상품 조회에 성공한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(mockOrderProductAdapter.getOrderProducts).mockResolvedValue(
        PayloadAdapterResultManager.ok([
          createOrderProductFixture({ id: 1 }),
          createOrderProductFixture({ id: 2 }),
          createOrderProductFixture({ id: 3 }),
        ]),
      );

      // When
      const result = await orderProductApiRepository.findMany(option);

      // Then
      expect(mockOrderProductAdapter.getOrderProducts).toHaveBeenCalledTimes(1);
      expect(mockOrderProductAdapter.getOrderProducts).toHaveBeenCalledWith(option);
      expect(result).toEqual(expect.schemaMatching(orderProductsSchema));
      expect(result.length).toBe(3);
    });

    it('주문상품 조회 실패시 BaseError를 throw한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(mockOrderProductAdapter.getOrderProducts).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => orderProductApiRepository.findMany(option)).rejects.toThrow(BaseError);
    });
  });

  describe('update', () => {
    it('주문상품 업데이트에 성공한다', async () => {
      // Given
      const dto = {
        orderProductId: 3,
        data: {
          orderProductStatus: 'pending',
        },
      } as UpdateOrderProductRequestDto;
      vi.mocked(mockOrderProductAdapter.updateOrderProduct).mockResolvedValue(
        PayloadAdapterResultManager.ok(createOrderProductFixture()),
      );

      // When
      const result = await orderProductApiRepository.update(dto);

      // Then
      expect(mockOrderProductAdapter.updateOrderProduct).toHaveBeenCalledTimes(1);
      expect(mockOrderProductAdapter.updateOrderProduct).toHaveBeenCalledWith(dto);
      expect(result).toEqual(expect.schemaMatching(orderProductSchema));
    });

    it('주문상품 업데이트 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        orderProductId: 3,
        data: {
          orderProductStatus: 'pending',
        },
      } as UpdateOrderProductRequestDto;
      vi.mocked(mockOrderProductAdapter.updateOrderProduct).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => orderProductApiRepository.update(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('updateMany', () => {
    it('주문상품 업데이트에 성공한다', async () => {
      // Given
      const dto = {
        orderProductIds: [1, 2, 3],
        data: {
          orderProductStatus: 'shipping',
        },
      } as BulkUpdateOrderProductRequestDto;
      vi.mocked(mockOrderProductAdapter.bulkUpdateOrderProduct).mockResolvedValue(
        PayloadAdapterResultManager.ok([
          createOrderProductFixture({ id: 1 }),
          createOrderProductFixture({ id: 2 }),
          createOrderProductFixture({ id: 3 }),
        ]),
      );

      // When
      const result = await orderProductApiRepository.updateMany(dto);

      // Then
      expect(mockOrderProductAdapter.bulkUpdateOrderProduct).toHaveBeenCalledTimes(1);
      expect(mockOrderProductAdapter.bulkUpdateOrderProduct).toBeCalledWith(dto);
      expect(result).toEqual(expect.schemaMatching(orderProductsSchema));
    });

    it('주문상품 업데이트에 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        orderProductIds: [1, 2, 3],
        data: {
          orderProductStatus: 'shipping',
        },
      } as BulkUpdateOrderProductRequestDto;
      vi.mocked(mockOrderProductAdapter.bulkUpdateOrderProduct).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => orderProductApiRepository.updateMany(dto)).rejects.toThrow(BaseError);
    });

    it.todo('shared layer에 BulkUpdateResult에 대한 테스트 코드를 작성해주세요');
  });
});
