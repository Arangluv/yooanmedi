import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError } from '@/shared';
import { createOrderFixture } from '@/entities/order/__test__';
import { ORDER_PRODUCT_STATUS } from '@/entities/order-product';
import { createUserFixture } from '@/entities/user/__test__';
import { createPointHistoryFixture } from '@/entities/point/__test__';
import { createOrderProductFixture } from '@/entities/order-product/__test__';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/entities/order';
import { POINT_ACTION } from '@/entities/point';
import { MockCancelOrderServiceDependency } from '../mocks';
import { PGPartialCancelCommand } from '../../infrastructure';
import { CancelOrderServiceDependencies } from '../../core';
import { PGPartialCancelCommandDto } from '../../infrastructure';

describe('PG Partial Cancel Command', () => {
  let dependencies: CancelOrderServiceDependencies;

  beforeEach(() => {
    dependencies = MockCancelOrderServiceDependency.success;
    vi.clearAllMocks();
  });

  describe('PGPartialCancelCommand', () => {
    let commandDto: PGPartialCancelCommandDto;
    let command: PGPartialCancelCommand;

    beforeEach(() => {
      commandDto = {
        order: createOrderFixture({ paymentsMethod: 'creditCard', paymentStatus: 'COMPLETE' }),
        orderProductId: 1,
      };
      command = new PGPartialCancelCommand(dependencies, commandDto);
    });

    it('PG 결제 부분취소가 실행된다', async () => {
      // When
      const result = await command.execute();

      // Then
      expect(result.message).toBe('주문이 취소처리 되었습니다');
    });

    it('주문상품을 취소상태로 업데이트 한다', async () => {
      // When
      await command.execute();

      // Then
      const { repository } = dependencies;
      expect(repository.orderProduct.update).toHaveBeenCalledTimes(1);
      expect(repository.orderProduct.update).toHaveBeenCalledWith({
        orderProductId: commandDto.orderProductId,
        data: {
          orderProductStatus: ORDER_PRODUCT_STATUS.cancelled,
        },
      });
    });

    it('포인트 사용 환불 내역이 생성된다', async () => {
      // When
      await command.execute();

      // Then
      const { repository } = dependencies;
      expect(repository.pointHistory.createRollbackHistory).toHaveBeenCalled();
      expect(repository.pointHistory.createRollbackHistory).toHaveBeenCalledWith({
        user: commandDto.order.user,
        orderProduct: commandDto.orderProductId,
        type: POINT_ACTION.cancel_use,
      });
    });

    it('유저 포인트가 업데이트 된다 [사용취소]', async () => {
      // Given
      const { repository } = dependencies;
      vi.mocked(repository.user.findById).mockResolvedValue(createUserFixture({ point: 1000 }));
      vi.mocked(repository.pointHistory.createRollbackHistory).mockResolvedValue(
        createPointHistoryFixture({ type: 'USE', amount: 120 }),
      );

      // When
      await command.execute();

      // Then
      expect(repository.user.update).toHaveBeenCalled();
      expect(repository.user.update).toHaveBeenCalledWith({
        user: commandDto.order.user,
        data: { point: 1120 },
      });
    });

    it('포인트 적립 롤백 내역이 생성된다', async () => {
      // When
      await command.execute();

      // Then
      const { repository } = dependencies;
      expect(repository.pointHistory.createRollbackHistory).toHaveBeenCalled();
      expect(repository.pointHistory.createRollbackHistory).toHaveBeenCalledWith({
        user: commandDto.order.user,
        orderProduct: commandDto.orderProductId,
        type: POINT_ACTION.cancel_earn,
      });
    });

    it('유저 포인트가 업데이트 된다 [사용취소]', async () => {
      // Given
      const { repository } = dependencies;
      vi.mocked(repository.user.findById).mockResolvedValue(createUserFixture({ point: 1000 }));
      vi.mocked(repository.pointHistory.createRollbackHistory).mockResolvedValue(
        createPointHistoryFixture({ type: 'EARN', amount: 120 }),
      );

      // When
      await command.execute();

      // Then
      expect(repository.user.update).toHaveBeenCalled();
      expect(repository.user.update).toHaveBeenCalledWith({
        user: commandDto.order.user,
        data: { point: 880 },
      });
    });

    it('주문상품이 모두 취소상태인 경우 취소상태로 업데이트 된다', async () => {
      // Given
      const { repository } = dependencies;
      vi.mocked(repository.orderProduct.findMany).mockResolvedValue([
        createOrderProductFixture({ orderProductStatus: 'cancelled' }),
        createOrderProductFixture({ orderProductStatus: 'cancelled' }),
        createOrderProductFixture({ orderProductStatus: 'cancelled' }),
      ]);

      // When
      await command.execute();

      // Then
      expect(repository.order.update).toHaveBeenCalledTimes(1);
      expect(repository.order.update).toHaveBeenCalledWith({
        order: commandDto.order.id,
        data: {
          orderStatus: ORDER_STATUS.cancelled,
          paymentStatus: PAYMENT_STATUS.total_cancel,
        },
      });
    });

    it('주문상품이 모두 취소상태가 아닌 경우 현재 주문상태로 업데이트 된다', async () => {
      // Given
      const { repository } = dependencies;
      vi.mocked(repository.orderProduct.findMany).mockResolvedValue([
        createOrderProductFixture({ orderProductStatus: 'cancelled' }),
        createOrderProductFixture({ orderProductStatus: 'cancelled' }),
        createOrderProductFixture({ orderProductStatus: 'preparing' }),
      ]);

      // When
      await command.execute();

      // Then
      expect(repository.order.update).toHaveBeenCalledTimes(1);
      expect(repository.order.update).toHaveBeenCalledWith({
        order: commandDto.order.id,
        data: {
          orderStatus: commandDto.order.orderStatus,
          paymentStatus: PAYMENT_STATUS.partial_cancel,
        },
      });
    });

    it('부분취소에 성공하면 transaction이 commit된다', async () => {
      // When
      await command.execute();

      // Then
      expect(dependencies.payload.db.commitTransaction).toHaveBeenCalled();
      expect(dependencies.payload.db.rollbackTransaction).not.toHaveBeenCalled();
    });

    it('부분취소에 실패시 transaction이 rollback되고 BaseError를 throw한다', async () => {
      // Given
      const dependencies = MockCancelOrderServiceDependency.fail;
      const command = new PGPartialCancelCommand(dependencies, commandDto);

      // When
      await expect(() => command.execute()).rejects.toThrow(BaseError);
      expect(dependencies.payload.db.rollbackTransaction).toHaveBeenCalledTimes(1);
      expect(dependencies.payload.db.commitTransaction).not.toHaveBeenCalled();
    });
  });
});
