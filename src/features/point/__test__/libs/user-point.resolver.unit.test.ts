import { describe, it, expect } from 'vitest';
import { UserPointResolver } from '../../libs';
import { POINT_ACTION } from '@/entities/point';

describe('UserPointResolver', () => {
  describe('calcUpdatePoint', () => {
    it.each([
      {
        caseName: '포인트 사용의 경우',
        expected: {
          name: '보유포인트에서 delta 포인트를 차감한 값을 반환한다',
          value: 80,
        },
        dto: {
          type: POINT_ACTION.use,
          currentPoint: 100,
          deltaPoint: 20,
        },
      },
      {
        caseName: '포인트 적립의 경우',
        expected: {
          name: '보유포인트에서 delta 포인트를 더한 값을 반환한다',
          value: 120,
        },
        dto: {
          type: POINT_ACTION.earn,
          currentPoint: 100,
          deltaPoint: 20,
        },
      },
      {
        caseName: '포인트 사용취소의 경우',
        expected: {
          name: '보유포인트에서 delta 포인트를 더한 값을 반환한다',
          value: 120,
        },
        dto: {
          type: POINT_ACTION.cancel_use,
          currentPoint: 100,
          deltaPoint: 20,
        },
      },
      {
        caseName: '포인트 적립취소의 경우',
        expected: {
          name: '보유포인트에서 delta 포인트를 차감한 값을 반환한다',
          value: 80,
        },
        dto: {
          type: POINT_ACTION.cancel_earn,
          currentPoint: 100,
          deltaPoint: 20,
        },
      },
    ])('$caseNmae -> $expected.name', ({ expected, dto }) => {
      // Given & When
      const result = UserPointResolver.calcUpdatePoint(dto);

      // Then
      expect(result).toBe(expected.value);
    });
  });
});
