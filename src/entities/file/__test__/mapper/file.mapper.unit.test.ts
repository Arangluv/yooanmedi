import { describe, it, expect } from 'vitest';
import { FileFixtures } from '../fixtures';
import { FileMapper } from '../../mapper';
import { fileSchema } from '../../schemas';

describe('File Mapper', () => {
  it('entity가 domain 객체로 변환된다', () => {
    // Given
    const entity = FileFixtures.entity;

    // When
    const result = FileMapper.toDomain(entity);

    // Then
    expect(result).toEqual(expect.schemaMatching(fileSchema));
  });
});
