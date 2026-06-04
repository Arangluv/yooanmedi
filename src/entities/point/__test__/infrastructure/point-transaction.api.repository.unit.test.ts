import { describe, it, expect, beforeEach, vi } from 'vitest';
import { BaseError, FindOption, TestErrorHelper } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockPointTransactionAdapter } from '../mocks';
import { basePointTransactionEntityFixture, createPointTransactionEntityFixture } from '../fixtures';
import { pointTransactionSchema } from '../../schemas';
import { PointTransactionApiRepository, PointTransactionAdapter } from '../../infrastructure';
import { CreatePointTransactionDto } from '../../types';

describe('Point Transaction API Repository', () => {
  let pointTransactionApiRepository: PointTransactionApiRepository;
  let mockPointTransactionAdapter: ReturnType<typeof PointTransactionAdapter>;

  beforeEach(() => {
    mockPointTransactionAdapter = MockPointTransactionAdapter();
    pointTransactionApiRepository = new PointTransactionApiRepository(mockPointTransactionAdapter);
  });

  describe('create', () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    it('point transaction이 생성된다', async () => {
      // Given
      const createEntity = {} as CreatePointTransactionDto;
      vi.mocked(mockPointTransactionAdapter.create).mockResolvedValue(
        PayloadAdapterResultManager.ok(basePointTransactionEntityFixture),
      );

      // When
      const result = await pointTransactionApiRepository.create(createEntity);

      // Then
      expect(result).toBeDefined();
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
    });

    it('실패시 Error를 throw한다', async () => {
      // Given
      const createEntity = {} as CreatePointTransactionDto;

      vi.mocked(mockPointTransactionAdapter.create).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => pointTransactionApiRepository.create(createEntity)).rejects.toThrow(BaseError);
    });
  });

  describe('findOne', () => {
    it('조회에 성공한다.', async () => {
      // Given
      const findOption = {} as FindOption;

      vi.mocked(mockPointTransactionAdapter.findOne).mockResolvedValue(
        PayloadAdapterResultManager.ok(createPointTransactionEntityFixture({ id: 1 })),
      );

      // When
      const result = await pointTransactionApiRepository.findOne(findOption);

      // Then
      expect(result).toBeDefined();
      expect(result).not.toBeInstanceOf(Array);
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
    });

    it('조회 실패시 Error를 throw한다', async () => {
      // Given
      const findOption = {} as FindOption;

      vi.mocked(mockPointTransactionAdapter.findOne).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => pointTransactionApiRepository.findOne(findOption)).rejects.toThrow(BaseError);
    });
  });
});
