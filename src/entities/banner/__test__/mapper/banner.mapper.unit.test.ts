import { describe, it, expect } from 'vitest';
import { BannerMapper } from '../../mapper';
import { bannerSchema } from '../../schemas';
import { createBannerEntityFixture } from '../fixtures';

describe('Banner Mapper', () => {
  describe('toDomain', () => {
    it('도메인 배너객체로 변환된다', () => {
      // Given
      const entity = createBannerEntityFixture();

      // When
      const result = BannerMapper.toDomain(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(bannerSchema));
    });
  });
});
