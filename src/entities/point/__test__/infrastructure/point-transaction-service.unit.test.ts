import { describe, it, vi, expect, beforeEach } from 'vitest';
import { MockPointTransactionAdapter } from '../mocks';
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
import { PointTransactionAdapter, PointTransactionApiRepository } from '../../infrastructure';
import { pointTransactionSchema } from '../../schemas';

describe('Point Transaction Service', () => {
  describe('UsePointTransactionService', () => {
    let usePointTransactionService: UsePointTransactionService;
    let mockPointTransactionAdapter: ReturnType<typeof PointTransactionAdapter>;
    let pointTransactionApiRepository: PointTransactionApiRepository;

    beforeEach(() => {
      mockPointTransactionAdapter = MockPointTransactionAdapter();
      pointTransactionApiRepository = new PointTransactionApiRepository(
        mockPointTransactionAdapter,
      );
      usePointTransactionService = new UsePointTransactionService(pointTransactionApiRepository);
    });

    it('포인트 사용내역 히스토리가 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        amount: 30,
      } as CreateUsePointHistoryRequestDto;
      vi.mocked(mockPointTransactionAdapter.create).mockResolvedValue({
        ...dto,
        id: 3416,
        reason: null,
        type: 'USE',
        updatedAt: '2026-05-13T07:42:38.801Z',
        createdAt: '2026-05-13T07:42:39.285Z',
      });

      // When
      const result = await usePointTransactionService.createHistory(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
      expect(mockPointTransactionAdapter.create).toHaveBeenCalledWith({ ...dto, type: 'USE' });
    });
  });

  describe('EarnPointTransactionService', () => {
    let earnPointTransactionService: EarnPointTransactionService;
    let mockPointTransactionAdapter: ReturnType<typeof PointTransactionAdapter>;
    let pointTransactionApiRepository: PointTransactionApiRepository;

    beforeEach(() => {
      mockPointTransactionAdapter = MockPointTransactionAdapter();
      pointTransactionApiRepository = new PointTransactionApiRepository(
        mockPointTransactionAdapter,
      );
      earnPointTransactionService = new EarnPointTransactionService(pointTransactionApiRepository);
    });

    it('포인트 적립 내역이 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
        amount: 30,
      } as CreateEarnPointHistoryRequestDto;
      vi.mocked(mockPointTransactionAdapter.create).mockResolvedValue({
        ...dto,
        id: 3416,
        reason: null,
        type: 'EARN',
        updatedAt: '2026-05-13T07:42:38.801Z',
        createdAt: '2026-05-13T07:42:39.285Z',
      });

      // When
      const result = await earnPointTransactionService.createHistory(dto);
      // Then
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
      expect(mockPointTransactionAdapter.create).toHaveBeenCalledWith({ ...dto, type: 'EARN' });
    });
  });

  describe('CancelUsePointTransactionService', () => {
    let cancelUsePointTransactionService: CancelUsePointTransactionService;
    let mockPointTransactionAdapter: ReturnType<typeof PointTransactionAdapter>;
    let pointTransactionApiRepository: PointTransactionApiRepository;

    beforeEach(() => {
      mockPointTransactionAdapter = MockPointTransactionAdapter();
      pointTransactionApiRepository = new PointTransactionApiRepository(
        mockPointTransactionAdapter,
      );
      cancelUsePointTransactionService = new CancelUsePointTransactionService(
        pointTransactionApiRepository,
      );
    });

    it('포인트 적립 내역이 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
      } as CreateCancelUsePointHistoryRequestDto;
      const amount = 100;
      vi.mocked(mockPointTransactionAdapter.create).mockResolvedValue({
        ...dto,
        amount,
        id: 3416,
        reason: null,
        type: 'CANCEL_USE',
        updatedAt: '2026-05-13T07:42:38.801Z',
        createdAt: '2026-05-13T07:42:39.285Z',
      });

      vi.mocked(mockPointTransactionAdapter.findOne).mockResolvedValue([
        {
          ...dto,
          amount,
          id: 3416,
          reason: null,
          type: 'USE',
          updatedAt: '2026-05-13T07:42:38.801Z',
          createdAt: '2026-05-13T07:42:39.285Z',
        },
      ]);

      // When
      const result = await cancelUsePointTransactionService.createHistory(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
      expect(mockPointTransactionAdapter.create).toHaveBeenCalledWith({
        ...dto,
        amount,
        type: 'CANCEL_USE',
      });
    });
  });

  describe('CancelEarnPointTransactionService', () => {
    let cancelEarnPointTransactionService: CancelEarnPointTransactionService;
    let mockPointTransactionAdapter: ReturnType<typeof PointTransactionAdapter>;
    let pointTransactionApiRepository: PointTransactionApiRepository;

    beforeEach(() => {
      mockPointTransactionAdapter = MockPointTransactionAdapter();
      pointTransactionApiRepository = new PointTransactionApiRepository(
        mockPointTransactionAdapter,
      );
      cancelEarnPointTransactionService = new CancelEarnPointTransactionService(
        pointTransactionApiRepository,
      );
    });

    it('포인트 적립 내역이 생성된다', async () => {
      // Given
      const dto = {
        user: 1,
        orderProduct: 3,
      } as CreateCancelEarnPointHistoryRequestDto;
      const amount = 100;
      vi.mocked(mockPointTransactionAdapter.create).mockResolvedValue({
        ...dto,
        amount,
        id: 3416,
        reason: null,
        type: 'CANCEL_USE',
        updatedAt: '2026-05-13T07:42:38.801Z',
        createdAt: '2026-05-13T07:42:39.285Z',
      });

      vi.mocked(mockPointTransactionAdapter.findOne).mockResolvedValue([
        {
          ...dto,
          amount,
          id: 3416,
          reason: null,
          type: 'EARN',
          updatedAt: '2026-05-13T07:42:38.801Z',
          createdAt: '2026-05-13T07:42:39.285Z',
        },
      ]);

      // When
      const result = await cancelEarnPointTransactionService.createHistory(dto);

      // Then
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
      expect(mockPointTransactionAdapter.create).toHaveBeenCalledWith({
        ...dto,
        amount,
        type: 'CANCEL_EARN',
      });
    });
  });
});
