import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  TransitionOrderService,
  TransitionOrderServiceDependencies,
} from '../../infrastructure/services';
import { MockTransitionOrderDependencies } from '../mocks';
import { TransitionOrderFixture } from '../fixtures';
import { BaseError } from '@/shared';

describe('TransitionOrderService', () => {
  const mockServiceDependencies =
    MockTransitionOrderDependencies.success as unknown as TransitionOrderServiceDependencies;

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('transitionOrder', () => {
    it('PG 주문의 상태가 변경된다', async () => {
      // Given
      const requestDto = TransitionOrderFixture.requestDto.transitionOrder.valid.pg;
      const {
        repository: {
          user: mockUserRepository,
          pointHistory: mockPointHistoryRepository,
          order: mockOrderRepository,
          orderProduct: mockOrderProductRepository,
        },
      } = mockServiceDependencies;

      // When
      const { transitionOrder } = TransitionOrderService(mockServiceDependencies);
      const result = await transitionOrder(requestDto);

      // Then
      expect(mockOrderRepository.update).toHaveBeenCalledTimes(1);
      expect(mockOrderProductRepository.updateMany).toHaveBeenCalled();
      expect(mockPointHistoryRepository.createUsageHistory).not.toHaveBeenCalled();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(result.message).toBeDefined();
    });

    it('PG 주문의 상태가 변경되고 transaction이 commit된다', async () => {
      // Given
      const requestDto = TransitionOrderFixture.requestDto.transitionOrder.valid.pg;
      const { payload: mockPayload } = mockServiceDependencies;

      // When
      const { transitionOrder } = TransitionOrderService(mockServiceDependencies);
      await transitionOrder(requestDto);

      // Then
      expect(mockPayload.db.commitTransaction).toHaveBeenCalled();
      expect(mockPayload.db.rollbackTransaction).not.toHaveBeenCalled();
    });

    it('PG 주문상태 변경 실패시 BaseError를 throw한다', async () => {
      // Given
      const requestDto = TransitionOrderFixture.requestDto.transitionOrder.valid.pg;
      const mockServiceDependencies =
        MockTransitionOrderDependencies.fail as unknown as TransitionOrderServiceDependencies;

      // When & Then
      const { transitionOrder } = TransitionOrderService(mockServiceDependencies);
      await expect(() => transitionOrder(requestDto)).rejects.toThrow(BaseError);
    });

    it('PG 주문상태 변경 실패시 transaction rollback이 실행된다', async () => {
      // Given
      const requestDto = TransitionOrderFixture.requestDto.transitionOrder.valid.pg;
      const mockServiceDependencies =
        MockTransitionOrderDependencies.fail as unknown as TransitionOrderServiceDependencies;

      // When & Then
      const { transitionOrder } = TransitionOrderService(mockServiceDependencies);
      await expect(() => transitionOrder(requestDto)).rejects.toThrow(BaseError);
      expect(mockServiceDependencies.payload.db.rollbackTransaction).toHaveBeenCalled();
      expect(mockServiceDependencies.payload.db.commitTransaction).not.toHaveBeenCalled();
    });

    it('무통장입금 주문의 상태가 변경된다', async () => {
      // Given
      const requestDto = TransitionOrderFixture.requestDto.transitionOrder.valid.bank.pending;
      const {
        repository: {
          user: mockUserRepository,
          pointHistory: mockPointHistoryRepository,
          order: mockOrderRepository,
          orderProduct: mockOrderProductRepository,
        },
      } = mockServiceDependencies;

      // When
      const { transitionOrder } = TransitionOrderService(mockServiceDependencies);
      const result = await transitionOrder(requestDto);

      // Then
      expect(result.message).toBeDefined();
    });

    it('무통장입금 주문 상태가 pending인 경우 포인트 내역생성 / 유저포인트 업데이트가 수행된다', async () => {
      // Given
      const requestDto = TransitionOrderFixture.requestDto.transitionOrder.valid.bank.pending;
      const {
        repository: {
          user: mockUserRepository,
          pointHistory: mockPointHistoryRepository,
          order: mockOrderRepository,
          orderProduct: mockOrderProductRepository,
        },
      } = mockServiceDependencies;

      // When
      const { transitionOrder } = TransitionOrderService(mockServiceDependencies);
      const result = await transitionOrder(requestDto);

      // Then
      expect(mockOrderRepository.update).toHaveBeenCalledTimes(1);
      expect(mockOrderProductRepository.updateMany).toHaveBeenCalled();
      expect(mockPointHistoryRepository.createUsageHistory).toHaveBeenCalled();
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
      expect(mockUserRepository.update).toHaveBeenCalledTimes(1);
      expect(result.message).toBeDefined();
    });

    it('무통장입금 주문 상태가 pending이 아닌 경우 포인트 내역생성 / 유저포인트 업데이트가 실행되지 않는다', async () => {
      // Given
      const requestDto = TransitionOrderFixture.requestDto.transitionOrder.valid.bank.preparing;
      const {
        repository: {
          user: mockUserRepository,
          pointHistory: mockPointHistoryRepository,
          order: mockOrderRepository,
          orderProduct: mockOrderProductRepository,
        },
      } = mockServiceDependencies;

      // When
      const { transitionOrder } = TransitionOrderService(mockServiceDependencies);
      const result = await transitionOrder(requestDto);

      // Then
      expect(mockOrderRepository.update).toHaveBeenCalledTimes(1);
      expect(mockOrderProductRepository.updateMany).toHaveBeenCalled();
      expect(mockPointHistoryRepository.createUsageHistory).not.toHaveBeenCalled();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.update).not.toHaveBeenCalled();
      expect(result.message).toBeDefined();
    });

    it('무통장입금 주문의 상태변경 실패 시 BaseError를 throw한다', async () => {
      // Given
      const requestDto = TransitionOrderFixture.requestDto.transitionOrder.valid.bank.pending;
      const mockServiceDependencies =
        MockTransitionOrderDependencies.fail as unknown as TransitionOrderServiceDependencies;

      // When & Then
      const { transitionOrder } = TransitionOrderService(mockServiceDependencies);
      await expect(() => transitionOrder(requestDto)).rejects.toThrow(BaseError);
    });

    it('무통장입금 주문의 상태변경 실패 시 transaction rollback이 실행된다', async () => {
      // Given
      const requestDto = TransitionOrderFixture.requestDto.transitionOrder.valid.bank.pending;
      const mockServiceDependencies =
        MockTransitionOrderDependencies.fail as unknown as TransitionOrderServiceDependencies;

      // When & Then
      const { transitionOrder } = TransitionOrderService(mockServiceDependencies);
      await expect(() => transitionOrder(requestDto)).rejects.toThrow(BaseError);
      expect(mockServiceDependencies.payload.db.rollbackTransaction).toHaveBeenCalled();
      expect(mockServiceDependencies.payload.db.commitTransaction).not.toHaveBeenCalled();
    });
  });

  describe('transitionOrder', () => {
    it('PG 주문리스트의 상태가 변경된다', async () => {
      // Given
      const requestDto = {
        orders: [
          TransitionOrderFixture.requestDto.transitionOrder.valid.pg.order,
          TransitionOrderFixture.requestDto.transitionOrder.valid.pg.order,
        ],
      };
      const {
        repository: {
          user: mockUserRepository,
          pointHistory: mockPointHistoryRepository,
          order: mockOrderRepository,
          orderProduct: mockOrderProductRepository,
        },
      } = mockServiceDependencies;

      // When
      const { transitionOrderList } = TransitionOrderService(mockServiceDependencies);
      const result = await transitionOrderList(requestDto);

      // Then
      expect(mockOrderRepository.update).toHaveBeenCalledTimes(requestDto.orders.length);
      expect(mockOrderProductRepository.updateMany).toHaveBeenCalled();
      expect(mockPointHistoryRepository.createUsageHistory).not.toHaveBeenCalled();
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(result.message).toBeDefined();
    });

    it('PG 주문리스트의 상태가 변경되고 transaction이 commit된다', async () => {
      // Given
      const requestDto = {
        orders: [
          TransitionOrderFixture.requestDto.transitionOrder.valid.pg.order,
          TransitionOrderFixture.requestDto.transitionOrder.valid.pg.order,
        ],
      };
      const { payload: mockPayload } = mockServiceDependencies;

      // When
      const { transitionOrderList } = TransitionOrderService(mockServiceDependencies);
      await transitionOrderList(requestDto);

      // Then
      expect(mockPayload.db.commitTransaction).toBeCalledTimes(requestDto.orders.length);
      expect(mockPayload.db.rollbackTransaction).not.toHaveBeenCalled();
    });

    it('PG 주문상태 변경 실패시 BaseError를 throw한다', async () => {
      // Given
      const requestDto = {
        orders: [
          TransitionOrderFixture.requestDto.transitionOrder.valid.pg.order,
          TransitionOrderFixture.requestDto.transitionOrder.valid.pg.order,
        ],
      };
      const mockServiceDependencies =
        MockTransitionOrderDependencies.fail as unknown as TransitionOrderServiceDependencies;

      // When & Then
      const { transitionOrderList } = TransitionOrderService(mockServiceDependencies);
      await expect(() => transitionOrderList(requestDto)).rejects.toThrow(BaseError);
    });

    it('PG 주문상태 변경 실패시 transaction rollback이 실행된다', async () => {
      // Given
      const requestDto = {
        orders: [
          TransitionOrderFixture.requestDto.transitionOrder.valid.pg.order,
          TransitionOrderFixture.requestDto.transitionOrder.valid.pg.order,
        ],
      };
      const mockServiceDependencies =
        MockTransitionOrderDependencies.fail as unknown as TransitionOrderServiceDependencies;

      // When & Then
      const { transitionOrderList } = TransitionOrderService(mockServiceDependencies);
      await expect(() => transitionOrderList(requestDto)).rejects.toThrow(BaseError);
      expect(mockServiceDependencies.payload.db.rollbackTransaction).toHaveBeenCalled();
      expect(mockServiceDependencies.payload.db.commitTransaction).not.toHaveBeenCalled();
    });

    it('무통장입금 주문의 상태가 변경된다', async () => {
      // Given
      const requestDto = {
        orders: [
          TransitionOrderFixture.requestDto.transitionOrder.valid.bank.pending.order,
          TransitionOrderFixture.requestDto.transitionOrder.valid.bank.pending.order,
        ],
      };

      // When
      const { transitionOrderList } = TransitionOrderService(mockServiceDependencies);
      const result = await transitionOrderList(requestDto);

      // Then
      expect(result.message).toBeDefined();
    });
  });
});
