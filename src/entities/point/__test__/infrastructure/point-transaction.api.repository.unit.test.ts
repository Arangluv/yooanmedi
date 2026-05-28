import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PointTransactionApiRepository, PointTransactionAdapter } from '../../infrastructure';
import { MockPointTransactionAdapter } from '../mocks';
import { pointTransactionSchema } from '../../schemas';
import { CreatePointTransactionEntity } from '../../types';

describe('Point Transaction API Repository', () => {
  let pointTransactionApiRepository: PointTransactionApiRepository;
  let mockPointTransactionAdapter: ReturnType<typeof PointTransactionAdapter>;

  beforeEach(() => {
    mockPointTransactionAdapter = MockPointTransactionAdapter();
    pointTransactionApiRepository = new PointTransactionApiRepository(mockPointTransactionAdapter);
  });

  describe('create', () => {
    it('point transaction이 생성된다', async () => {
      // Given
      const createEntity = {
        user: 3,
        orderProduct: 1869,
        amount: 156,
        type: 'USE',
      } as CreatePointTransactionEntity;

      vi.mocked(mockPointTransactionAdapter.create).mockResolvedValue({
        id: 3416,
        user: 3,
        orderProduct: 1869,
        type: 'USE',
        reason: null,
        amount: 156,
        updatedAt: '2026-05-13T07:42:38.801Z',
        createdAt: '2026-05-13T07:42:39.285Z',
      });

      // When
      const result = await pointTransactionApiRepository.create(createEntity);

      // Then
      expect(result).toBeDefined();
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
    });
  });

  describe('findOne', () => {
    it('point transaction을 findOption에 맞게 조회한다', async () => {
      // Given
      const findOption = {} as any;

      vi.mocked(mockPointTransactionAdapter.findOne).mockResolvedValue([
        {
          id: 3416,
          user: 3,
          orderProduct: 1869,
          type: 'USE',
          reason: null,
          amount: 156,
          updatedAt: '2026-05-13T07:42:38.801Z',
          createdAt: '2026-05-13T07:42:39.285Z',
        },
      ]);

      // When
      const result = await pointTransactionApiRepository.findOne(findOption);

      // Then
      expect(result).toBeDefined();
      expect(result).not.toBeInstanceOf(Array);
      expect(result).toEqual(expect.schemaMatching(pointTransactionSchema));
    });
  });

  it.todo(
    'updateUserPoint, getUser는 테스트코드를 작성하지 않고, user Entity에 작성합니다 작성 후 해당코드는 지워주세요',
  );
});
