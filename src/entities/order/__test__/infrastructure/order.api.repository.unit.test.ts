import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockOrderAdapter } from '../mocks';
import { createOrderEntityFixture } from '../fixtures';
import { CreateOrderRequestForBankTransferDto, CreateOrderRequestForPgDto, UpdateOrderRequestDto } from '../../dto';
import { OrderApiRepository, OrderAdapter } from '../../infrastructure';

describe('Order Api Repository', () => {
  let mockAdapter: ReturnType<typeof OrderAdapter>;
  let repository: OrderApiRepository;

  beforeEach(() => {
    mockAdapter = MockOrderAdapter();
    repository = new OrderApiRepository(mockAdapter);
  });

  describe('create', () => {
    it('주문 생성에 성공한다', async () => {
      // Given
      const dto = {
        user: 3,
        paymentsMethod: 'creditCard',
        orderStatus: 'preparing',
        flgStatus: 'INIT_NORMAL',
        paymentStatus: 'COMPLETE',
        orderDeliveryFee: 0,
        orderRequest: '',
        orderNo: '202605134816124',
        finalPrice: 6000,
        usedPoint: 0,
      } as CreateOrderRequestForPgDto;
      vi.mocked(mockAdapter.createOrder).mockResolvedValue(PayloadAdapterResultManager.ok(createOrderEntityFixture()));

      // When
      await repository.create(dto);

      // Then
      expect(mockAdapter.createOrder).toHaveBeenCalledTimes(1);
      expect(mockAdapter.createOrder).toBeCalledWith(dto);
    });

    it('주문 생성에 실패할 경우 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        user: 3,
        paymentsMethod: 'bankTransfer',
        orderStatus: 'pending',
        flgStatus: 'INIT_NORMAL',
        paymentStatus: 'PENDING',
        orderDeliveryFee: 0,
        orderRequest: '',
        orderNo: '202605134816124',
        finalPrice: 6000,
        usedPoint: 0,
      } as CreateOrderRequestForBankTransferDto;
      vi.mocked(mockAdapter.createOrder).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.create(dto)).rejects.toThrow(BaseError);
    });
  });

  describe('findById', () => {
    it('주문 조회에 성공한다', async () => {
      // Given
      const targetOrderId = 3;
      vi.mocked(mockAdapter.getOrderById).mockResolvedValue(PayloadAdapterResultManager.ok(createOrderEntityFixture()));

      // When
      await repository.findById(targetOrderId);

      // Then
      expect(mockAdapter.getOrderById).toHaveBeenCalledTimes(1);
      expect(mockAdapter.getOrderById).toBeCalledWith(targetOrderId);
    });

    it('주문 조회에 실패할 경우 BaseError를 throw한다', async () => {
      // Given
      const targetOrderId = 3;
      vi.mocked(mockAdapter.getOrderById).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.findById(targetOrderId)).rejects.toThrow(BaseError);
    });
  });

  describe('update', () => {
    it('주문 업데이트에 성공한다', async () => {
      // Given
      const dto = {
        order: 3,
        data: {
          orderStatus: 'delivered',
        },
      } as UpdateOrderRequestDto;
      vi.mocked(mockAdapter.updateOrder).mockResolvedValue(PayloadAdapterResultManager.ok(createOrderEntityFixture()));

      // When
      await repository.update(dto);

      // Then
      expect(mockAdapter.updateOrder).toHaveBeenCalledTimes(1);
      expect(mockAdapter.updateOrder).toBeCalledWith(dto);
    });

    it('주문 업데이트에 실패할 경우 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        order: 3,
        data: {
          orderStatus: 'delivered',
        },
      } as UpdateOrderRequestDto;
      vi.mocked(mockAdapter.updateOrder).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => repository.update(dto)).rejects.toThrow(BaseError);
    });
  });
});
