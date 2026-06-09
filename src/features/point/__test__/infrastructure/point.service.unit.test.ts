import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createUserFixture, UserRepositoryMocks } from '@/entities/user/__test__';
import {
  createPointTransactionFixture,
  PointTransactionRepositoryMocks,
} from '@/entities/point/__test__';
import { PointService, PointServiceDependencies } from '../../infrastructure/point.service';
import {
  CreatePointRefundHistoryRequestDto,
  CreatePointUsageHistoryRequestDto,
  UpdateUserPointRequestDto,
} from '../../dto';
import { BaseError } from '@/shared';

describe('PointService', () => {
  describe('Success Case', () => {
    let useCases: ReturnType<typeof PointService>;
    let dependencies: PointServiceDependencies;

    beforeEach(() => {
      const userRepository = UserRepositoryMocks.createSuccess();
      const pointRepository = PointTransactionRepositoryMocks.createSuccess();

      dependencies = {
        repository: {
          user: userRepository,
          point: pointRepository,
        },
      } as unknown as PointServiceDependencies;
      useCases = PointService(dependencies);
    });

    it('[createUsageHistory] 포인트 사용 히스토리가 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        type: 'USE',
        amount: 100,
      } as CreatePointUsageHistoryRequestDto;

      // When
      await useCases.createUsageHistory(dto);

      // Then
      expect(dependencies.repository.point.create).toHaveBeenCalledWith(dto);
      expect(dependencies.repository.point.create).toHaveBeenCalledTimes(1);
    });

    it('[createUsageHistory] 포인트 적립 히스토리가 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        type: 'EARN',
        amount: 100,
      } as CreatePointUsageHistoryRequestDto;

      // When
      await useCases.createUsageHistory(dto);

      // Then
      expect(dependencies.repository.point.create).toHaveBeenCalledWith(dto);
      expect(dependencies.repository.point.create).toHaveBeenCalledTimes(1);
    });

    it('[createRefundHistory] 포인트 사용취소 히스토리가 생성된다', async () => {
      // Given
      const rollbackAmount = 351;
      const dto = {
        user: 1,
        orderProduct: 3,
        type: 'CANCEL_USE',
        rollbackType: 'USE',
      } as CreatePointRefundHistoryRequestDto;
      vi.mocked(dependencies.repository.point.findOne).mockResolvedValue(
        createPointTransactionFixture({
          type: 'USE',
          amount: rollbackAmount,
        }),
      );

      // When
      await useCases.createRefundHistory(dto);

      // Then
      expect(dependencies.repository.point.create).toHaveBeenCalledWith({
        user: dto.user,
        orderProduct: dto.orderProduct,
        type: 'CANCEL_USE',
        amount: rollbackAmount,
      });
      expect(dependencies.repository.point.create).toHaveBeenCalledTimes(1);
    });

    it('[createRefundHistory] 포인트 적립취소 히스토리가 생성된다', async () => {
      // Given
      const rollbackAmount = 351;
      const dto = {
        user: 1,
        orderProduct: 3,
        type: 'CANCEL_EARN',
        rollbackType: 'EARN',
      } as CreatePointRefundHistoryRequestDto;
      vi.mocked(dependencies.repository.point.findOne).mockResolvedValue(
        createPointTransactionFixture({
          type: 'EARN',
          amount: rollbackAmount,
        }),
      );

      // When
      await useCases.createRefundHistory(dto);

      // Then
      expect(dependencies.repository.point.create).toHaveBeenCalledWith({
        user: dto.user,
        orderProduct: dto.orderProduct,
        type: 'CANCEL_EARN',
        amount: rollbackAmount,
      });
      expect(dependencies.repository.point.create).toHaveBeenCalledTimes(1);
    });

    it('[updateUserPointByHistories] 유저 포인트가 업데이트 된다', async () => {
      // Given
      const dto = {
        user: 1,
        type: 'USE',
        histories: [
          createPointTransactionFixture({ id: 1, amount: 100 }),
          createPointTransactionFixture({ id: 1, amount: 200 }),
          createPointTransactionFixture({ id: 1, amount: 300 }),
        ],
      } as UpdateUserPointRequestDto;

      // When
      await useCases.updateUserPointByHistories(dto);

      // Then
      const user = await dependencies.repository.user.findById(dto.user);
      expect(dependencies.repository.user.update).toHaveBeenCalledWith({
        user: dto.user,
        data: { point: user.point - 600 },
      });
      expect(dependencies.repository.user.update).toHaveBeenCalledTimes(1);
    });
  });

  describe('Fail Case', () => {
    let useCases: ReturnType<typeof PointService>;
    let dependencies: PointServiceDependencies;

    beforeEach(() => {
      const userRepository = UserRepositoryMocks.createError();
      const pointRepository = PointTransactionRepositoryMocks.createError();

      dependencies = {
        repository: {
          user: userRepository,
          point: pointRepository,
        },
      } as unknown as PointServiceDependencies;
      useCases = PointService(dependencies);
    });

    it('[createUsageHistory] 포인트 사용/적립 히스토리 생성 실패시 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        type: 'USE',
        amount: 100,
      } as CreatePointUsageHistoryRequestDto;

      // When & Then
      await expect(() => useCases.createUsageHistory(dto)).rejects.toThrow(BaseError);
    });

    it('[createRefundHistory] 포인트 사용/적립 취소 히스토리 생성 실패시 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        type: 'CANCEL_USE',
        rollbackType: 'USE',
      } as CreatePointRefundHistoryRequestDto;

      // When & Then
      await expect(() => useCases.createRefundHistory(dto)).rejects.toThrow(BaseError);
    });

    it('[updateUserPointByHistories] 업데이트 되는 유저포인트가 음수인 경우 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        user: 1,
        type: 'USE',
        histories: [
          createPointTransactionFixture({ id: 1, amount: 100 }),
          createPointTransactionFixture({ id: 1, amount: 200 }),
          createPointTransactionFixture({ id: 1, amount: 300 }),
        ],
      } as UpdateUserPointRequestDto;
      vi.mocked(dependencies.repository.user.findById).mockResolvedValue(
        createUserFixture({
          point: 0,
        }),
      );

      // When & Then - 유저 보유포인트 0, 사용포인트 600
      await expect(() => useCases.updateUserPointByHistories(dto)).rejects.toThrow(BaseError);
    });

    it('[updateUserPointByHistories] 유저 포인트 업데이트 실패 시 BaseError를 throw한다', async () => {
      // Given
      const dto = {
        user: 1,
        type: 'USE',
        histories: [
          createPointTransactionFixture({ id: 1, amount: 100 }),
          createPointTransactionFixture({ id: 1, amount: 200 }),
          createPointTransactionFixture({ id: 1, amount: 300 }),
        ],
      } as UpdateUserPointRequestDto;

      // When & Then
      await expect(() => useCases.updateUserPointByHistories(dto)).rejects.toThrow(BaseError);
    });
  });
});
