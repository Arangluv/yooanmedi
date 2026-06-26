import { describe, it, expect } from 'vitest';
import { PopupFixtures } from '../fixtures';
import { PopupMapper } from '../../mapper';
import { popupSchema } from '../../schemas';

describe('Popup Mapper', () => {
  it('[toDomain] 도메인 팝업 데이터로 변환된다', () => {
    // Given
    const entity = PopupFixtures.entity;

    // When
    const result = PopupMapper.toDomain(entity);

    // Then
    expect(result).toEqual(expect.schemaMatching(popupSchema));
  });
});
