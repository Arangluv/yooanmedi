import { describe, it, vi, expect, beforeEach } from 'vitest';
import { BaseError, TestErrorHelper } from '@/shared';
import { MockUserRepository } from '@/entities/user/@x/point';
import { UsePointTransactionService } from '../../infrastructure/services/use';
import { EarnPointTransactionService } from '../../infrastructure/services/earn';
import { CancelUsePointTransactionService } from '../../infrastructure/services/cancel-use';
import { CancelEarnPointTransactionService } from '../../infrastructure/services/cancel-earn';
import {
  CreateCancelEarnPointHistoryRequestDto,
  CreateCancelUsePointHistoryRequestDto,
  CreateEarnPointHistoryRequestDto,
  CreateUsePointHistoryRequestDto,
} from '../../dto';
import { pointTransactionSchema } from '../../schemas';
import { MockPointTransactionRepository } from '../mocks';
import { createPointTransactionFixture } from '../fixtures';
import { createUserFixture } from '@/entities/user/__test__';

describe('Point Transaction Service', () => {
  let mockPointTransactionApiRepository: ReturnType<typeof MockPointTransactionRepository>;
  let mockUserApiRepository: ReturnType<typeof MockUserRepository>;

  describe('UsePointTransactionService', () => {
    let usePointTransactionService: UsePointTransactionService;

    beforeEach(() => {
      mockPointTransactionApiRepository = MockPointTransactionRepository();
      mockUserApiRepository = MockUserRepository();
      usePointTransactionService = new UsePointTransactionService(
        mockPointTransactionApiRepository,
        mockUserApiRepository,
      );
    });

    it('포인트 사용내역 히스토리가 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        amount: 30,
      } as CreateUsePointHistoryRequestDto;
      vi.mocked(mockPointTransactionApiRepository.create).mockResolvedValue(
        createPointTransactionFixture({ ...dto }),
      );

      // When
      const result = await usePointTransactionService.createHistory(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
      expect(mockPointTransactionApiRepository.create).toHaveBeenCalledWith({
        ...dto,
        type: 'USE',
      });
    });

    it('잘못된 DTO 전달 시 error를 throw한다', async () => {
      // Given
      const dto = {
        userName: 'test',
      } as any;

      // When & Then
      await expect(() => usePointTransactionService.createHistory(dto)).rejects.toThrow(BaseError);
    });

    it('create에 실패하면 error를 throw한다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        amount: 30,
      } as CreateUsePointHistoryRequestDto;
      vi.mocked(mockPointTransactionApiRepository.create).mockRejectedValue(
        TestErrorHelper.generateAdapterError(),
      );

      // When & Then
      await expect(() => usePointTransactionService.createHistory(dto)).rejects.toThrow(BaseError);
    });

    it('updateUserPoint시 기존 포인트에서 사용한 포인트를 차감한 후 업데이트한다', async () => {
      // Given
      const userId = 3;
      const histories = [
        createPointTransactionFixture({ id: 1, amount: 100 }),
        createPointTransactionFixture({ id: 1, amount: 200 }),
        createPointTransactionFixture({ id: 1, amount: 300 }),
      ];
      vi.mocked(mockUserApiRepository.findById).mockResolvedValue(
        createUserFixture({ id: 3, point: 1000 }),
      );
      vi.mocked(mockUserApiRepository.update).mockResolvedValue({} as any);

      // When - 1000 - 600
      await usePointTransactionService.updateUserPointFromHistories(userId, histories);

      // Then
      expect(mockUserApiRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUserApiRepository.update).toBeCalledWith({ user: 3, data: { point: 400 } });
    });

    it('updatePoint가 0이하면 Error를 Throw한다', async () => {
      // Given
      const userId = 3;
      const histories = [
        createPointTransactionFixture({ id: 1, amount: 100 }),
        createPointTransactionFixture({ id: 1, amount: 200 }),
        createPointTransactionFixture({ id: 1, amount: 300 }),
      ];
      vi.mocked(mockUserApiRepository.findById).mockResolvedValue(
        createUserFixture({ id: 3, point: 300 }),
      );
      vi.mocked(mockUserApiRepository.update).mockResolvedValue({} as any);

      // When & Then
      await expect(() =>
        usePointTransactionService.updateUserPointFromHistories(userId, histories),
      ).rejects.toThrow(BaseError);
    });
  });

  describe('EarnPointTransactionService', () => {
    let earnPointTransactionService: EarnPointTransactionService;

    beforeEach(() => {
      mockPointTransactionApiRepository = MockPointTransactionRepository();
      mockUserApiRepository = MockUserRepository();
      earnPointTransactionService = new EarnPointTransactionService(
        mockPointTransactionApiRepository,
        mockUserApiRepository,
      );
    });

    it('포인트 적립 내역이 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        amount: 30,
      } as CreateEarnPointHistoryRequestDto;
      vi.mocked(mockPointTransactionApiRepository.create).mockResolvedValue(
        createPointTransactionFixture({ ...dto }),
      );

      // When
      const result = await earnPointTransactionService.createHistory(dto);
      // Then
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
      expect(mockPointTransactionApiRepository.create).toHaveBeenCalledWith({
        ...dto,
        type: 'EARN',
      });
    });

    it('잘못된 DTO 전달 시 error를 throw한다', async () => {
      // Given
      const dto = {
        userName: 'test',
      } as any;

      // When & Then
      await expect(() => earnPointTransactionService.createHistory(dto)).rejects.toThrow(BaseError);
    });

    it('create에 실패하면 error를 throw한다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        amount: 30,
      } as CreateEarnPointHistoryRequestDto;
      vi.mocked(mockPointTransactionApiRepository.create).mockRejectedValue(
        TestErrorHelper.generateAdapterError(),
      );

      // When & Then
      await expect(() => earnPointTransactionService.createHistory(dto)).rejects.toThrow(BaseError);
    });

    it('updateUserPoint시 기존 포인트에서 적립될 포인트를 더한 후  업데이트한다', async () => {
      // Given
      const userId = 3;
      const histories = [
        createPointTransactionFixture({ id: 1, amount: 100 }),
        createPointTransactionFixture({ id: 1, amount: 200 }),
        createPointTransactionFixture({ id: 1, amount: 300 }),
      ];
      vi.mocked(mockUserApiRepository.findById).mockResolvedValue(
        createUserFixture({ id: 3, point: 1000 }),
      );
      vi.mocked(mockUserApiRepository.update).mockResolvedValue({} as any);

      // When - 1000 + 600
      await earnPointTransactionService.updateUserPointFromHistories(userId, histories);

      // Then
      expect(mockUserApiRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUserApiRepository.update).toBeCalledWith({ user: 3, data: { point: 1600 } });
    });
  });

  describe('CancelUsePointTransactionService', () => {
    let cancelUsePointTransactionService: CancelUsePointTransactionService;

    beforeEach(() => {
      mockPointTransactionApiRepository = MockPointTransactionRepository();
      mockUserApiRepository = MockUserRepository();
      cancelUsePointTransactionService = new CancelUsePointTransactionService(
        mockPointTransactionApiRepository,
        mockUserApiRepository,
      );
    });

    it('포인트 적립 내역이 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
      } as CreateCancelUsePointHistoryRequestDto;
      const amount = 100;
      vi.mocked(mockPointTransactionApiRepository.findOne).mockResolvedValue({
        id: 3416,
        ...dto,
        amount,
        type: 'USE',
      });
      vi.mocked(mockPointTransactionApiRepository.create).mockResolvedValue(
        createPointTransactionFixture({ ...dto, amount }),
      );

      // When
      const result = await cancelUsePointTransactionService.createHistory(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
      expect(mockPointTransactionApiRepository.create).toHaveBeenCalledWith({
        ...dto,
        amount,
        type: 'CANCEL_USE',
      });
    });

    it('잘못된 DTO 전달 시 error를 throw한다', async () => {
      // Given
      const dto = {
        userName: 'test',
      } as any;

      // When & Then
      await expect(() => cancelUsePointTransactionService.createHistory(dto)).rejects.toThrow(
        BaseError,
      );
    });

    it('create에 실패하면 error를 throw한다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        amount: 30,
      } as CreateCancelUsePointHistoryRequestDto;
      vi.mocked(mockPointTransactionApiRepository.create).mockRejectedValue(
        TestErrorHelper.generateAdapterError(),
      );

      // When & Then
      await expect(() => cancelUsePointTransactionService.createHistory(dto)).rejects.toThrow(
        BaseError,
      );
    });

    it('updateUserPoint시 기존 포인트에서 사용한 포인트를 다시 더한 후 업데이트한다', async () => {
      // Given
      const userId = 3;
      const histories = [
        createPointTransactionFixture({ id: 1, amount: 100 }),
        createPointTransactionFixture({ id: 1, amount: 200 }),
        createPointTransactionFixture({ id: 1, amount: 300 }),
      ];
      vi.mocked(mockUserApiRepository.findById).mockResolvedValue(
        createUserFixture({ id: 3, point: 1000 }),
      );
      vi.mocked(mockUserApiRepository.update).mockResolvedValue({} as any);

      // When - 1000 + 600
      await cancelUsePointTransactionService.updateUserPointFromHistories(userId, histories);

      // Then
      expect(mockUserApiRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUserApiRepository.update).toBeCalledWith({ user: 3, data: { point: 1600 } });
    });
  });

  describe('CancelEarnPointTransactionService', () => {
    let cancelEarnPointTransactionService: CancelEarnPointTransactionService;

    beforeEach(() => {
      mockPointTransactionApiRepository = MockPointTransactionRepository();
      mockUserApiRepository = MockUserRepository();
      cancelEarnPointTransactionService = new CancelEarnPointTransactionService(
        mockPointTransactionApiRepository,
        mockUserApiRepository,
      );
    });

    it('포인트 적립 내역이 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
      } as CreateCancelEarnPointHistoryRequestDto;
      const amount = 100;
      vi.mocked(mockPointTransactionApiRepository.findOne).mockResolvedValue({
        ...dto,
        amount,
        id: 3416,
        type: 'EARN',
      });
      vi.mocked(mockPointTransactionApiRepository.create).mockResolvedValue(
        createPointTransactionFixture({ ...dto, amount }),
      );

      // When
      const result = await cancelEarnPointTransactionService.createHistory(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
      expect(mockPointTransactionApiRepository.create).toHaveBeenCalledWith({
        ...dto,
        amount,
        type: 'CANCEL_EARN',
      });
    });

    it('잘못된 DTO 전달 시 error를 throw한다', async () => {
      // Given
      const dto = {
        userName: 'test',
      } as any;

      // When & Then
      await expect(() => cancelEarnPointTransactionService.createHistory(dto)).rejects.toThrow(
        BaseError,
      );
    });

    it('create에 실패하면 error를 throw한다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        amount: 30,
      } as CreateCancelUsePointHistoryRequestDto;
      vi.mocked(mockPointTransactionApiRepository.create).mockRejectedValue(
        TestErrorHelper.generateAdapterError(),
      );

      // When & Then
      await expect(() => cancelEarnPointTransactionService.createHistory(dto)).rejects.toThrow(
        BaseError,
      );
    });

    it('updateUserPoint시 기존 포인트에서 적립된 포인트를 차감 후 업데이트한다', async () => {
      // Given
      const userId = 3;
      const histories = [
        createPointTransactionFixture({ id: 1, amount: 100 }),
        createPointTransactionFixture({ id: 1, amount: 200 }),
        createPointTransactionFixture({ id: 1, amount: 300 }),
      ];
      vi.mocked(mockUserApiRepository.findById).mockResolvedValue(
        createUserFixture({ id: 3, point: 1000 }),
      );
      vi.mocked(mockUserApiRepository.update).mockResolvedValue({} as any);

      // When - 1000 + 600
      await cancelEarnPointTransactionService.updateUserPointFromHistories(userId, histories);

      // Then
      expect(mockUserApiRepository.update).toHaveBeenCalledTimes(1);
      expect(mockUserApiRepository.update).toBeCalledWith({ user: 3, data: { point: 400 } });
    });
  });
});
