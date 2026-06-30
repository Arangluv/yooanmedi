import { describe, it, expect } from 'vitest';
import { createMetaSettingEntityFixture } from '../fixtures';
import { MetaSettingMapper } from '../../mapper';
import { metaSettingSchema } from '../../schemas';

describe('MetaSetting Mapper', () => {
  describe('toDomain', () => {
    it('도메인 객체로 변환된다', () => {
      // Given
      const entity = createMetaSettingEntityFixture();

      // When
      const result = MetaSettingMapper.toDomain(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(metaSettingSchema));
    });
  });
});
