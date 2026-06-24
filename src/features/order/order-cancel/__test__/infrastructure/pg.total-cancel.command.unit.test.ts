import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError } from '@/shared';
import { createOrderFixture } from '@/entities/order/__test__';
import { createOrderProductFixture } from '@/entities/order-product/__test__';
import { ORDER_STATUS, PAYMENT_STATUS } from '@/entities/order';
import { MockCancelOrderServiceDependency } from '../mocks';
import { PGTotalCancelCommand, PGTotalCancelCommandDto } from '../../infrastructure';
import { CancelOrderServiceDependencies } from '../../core';

describe('PG Total Cancel Command', () => {
  let dependencies: CancelOrderServiceDependencies;
  let commandDto: PGTotalCancelCommandDto;
  let command: PGTotalCancelCommand;

  beforeEach(() => {
    dependencies = MockCancelOrderServiceDependency.success;
    commandDto = {
      order: createOrderFixture({ paymentsMethod: 'bankTransfer', paymentStatus: 'COMPLETE' }),
    };
    command = new PGTotalCancelCommand(dependencies, commandDto);

    vi.mocked(dependencies.repository.orderProduct.findMany).mockResolvedValue([
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
    ]);
    vi.clearAllMocks();
  });

  it('전체 주문상품 결제 취소가 실행된다', async () => {
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
    expect(repository.orderProduct.update).toHaveBeenCalledTimes(3);
  });

  it('포인트 사용 환불 내역이 생성된다', async () => {
    // When
    await command.execute();

    // Then
    const { repository } = dependencies;
    expect(repository.pointHistory.createRollbackHistory).toHaveBeenCalledTimes(6);
  });

  it('이미 취소된 주문상품의 경우 포인트 사용 환불 내역이 생성되지 않는다', async () => {
    // Given
    const { repository } = dependencies;
    vi.mocked(repository.orderProduct.findMany).mockResolvedValue([
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'cancel_request' }),
      createOrderProductFixture({ orderProductStatus: 'cancelled' }),
    ]);

    // When
    await command.execute();

    // Then
    expect(repository.pointHistory.createRollbackHistory).toHaveBeenCalledTimes(4);
  });

  it('유저 포인트가 업데이트 된다 [포인트 사용 환불]', async () => {
    // Given
    const { repository } = dependencies;

    // When
    await command.execute();

    // Then
    expect(repository.user.update).toHaveBeenCalledTimes(6);
  });

  it('이미 취소된 주문 상품에서는 유저 포인트가 업데이트 되지 않는다 [포인트 사용 환불]', async () => {
    // Given
    const { repository } = dependencies;
    vi.mocked(repository.orderProduct.findMany).mockResolvedValue([
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'cancel_request' }),
      createOrderProductFixture({ orderProductStatus: 'cancelled' }),
    ]);

    // When
    await command.execute();

    // Then
    expect(repository.user.update).toHaveBeenCalledTimes(4);
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

  it('포인트 적립 롤백 내역이 생성된다', async () => {
    // When
    await command.execute();

    // Then
    const { repository } = dependencies;
    expect(repository.pointHistory.createRollbackHistory).toHaveBeenCalledTimes(6);
  });

  it('이미 취소된 주문상품의 경우 포인트 적립 롤백 내역이 생성되지 않는다', async () => {
    // Given
    const { repository } = dependencies;
    vi.mocked(repository.orderProduct.findMany).mockResolvedValue([
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'cancel_request' }),
      createOrderProductFixture({ orderProductStatus: 'cancelled' }),
    ]);

    // When
    await command.execute();

    // Then
    expect(repository.pointHistory.createRollbackHistory).toHaveBeenCalledTimes(4);
  });

  it('유저 포인트가 업데이트 된다 [포인트 적립 롤백]', async () => {
    // Given
    const { repository } = dependencies;

    // When
    await command.execute();

    // Then
    expect(repository.user.update).toHaveBeenCalledTimes(6);
  });

  it('이미 취소된 주문 상품에서는 유저 포인트가 업데이트 되지 않는다 [포인트 적립 롤백]', async () => {
    // Given
    const { repository } = dependencies;
    vi.mocked(repository.orderProduct.findMany).mockResolvedValue([
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'cancel_request' }),
      createOrderProductFixture({ orderProductStatus: 'cancelled' }),
    ]);

    // When
    await command.execute();

    // Then
    expect(repository.user.update).toHaveBeenCalledTimes(4);
  });

  it('주문이 취소상태로 업데이트 된다', async () => {
    // When
    await command.execute();

    // Then
    const { repository } = dependencies;
    expect(repository.order.update).toHaveBeenCalledTimes(1);
    expect(repository.order.update).toHaveBeenCalledWith({
      order: commandDto.order.id,
      data: {
        orderStatus: ORDER_STATUS.cancelled,
        paymentStatus: PAYMENT_STATUS.total_cancel,
      },
    });
  });

  it('주문상품 중 일부가 취소되었다면 Easypay 부분취소 요청이 실행된다', async () => {
    // Given
    const { repository } = dependencies;
    vi.mocked(repository.orderProduct.findMany).mockResolvedValue([
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'cancelled' }),
    ]);

    // When
    await command.execute();

    // Then
    expect(repository.easyPay.partialCancel).toHaveBeenCalled();
    expect(repository.easyPay.totalCancel).not.toHaveBeenCalled();
  });

  it('주문상품 중 취소된 상품이 없다면 Easypay 전체취소 요청이 실행된다', async () => {
    // Given
    const { repository } = dependencies;
    vi.mocked(repository.orderProduct.findMany).mockResolvedValue([
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
      createOrderProductFixture({ orderProductStatus: 'preparing' }),
    ]);

    // When
    await command.execute();

    // Then
    expect(repository.easyPay.totalCancel).toHaveBeenCalled();
    expect(repository.easyPay.partialCancel).not.toHaveBeenCalled();
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
    const command = new PGTotalCancelCommand(dependencies, commandDto);

    // When
    await expect(() => command.execute()).rejects.toThrow(BaseError);
    expect(dependencies.payload.db.rollbackTransaction).toHaveBeenCalledTimes(1);
    expect(dependencies.payload.db.commitTransaction).not.toHaveBeenCalled();
  });
});
