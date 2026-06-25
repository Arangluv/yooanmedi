import { describe, it, expect } from 'vitest';
import { TermsFixtures } from '../fixtures';
import { TermsMapper } from '../../mapper';
import { termsSchema } from '../../schemas';

describe('TermsMapper', () => {
  describe('toDomain', () => {
    it('약관 도메인 데이터로 변환된다', () => {
      // Given
      const entity = TermsFixtures.entity;

      // When
      const result = TermsMapper.toDomain(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(termsSchema));
    });
  });
});
