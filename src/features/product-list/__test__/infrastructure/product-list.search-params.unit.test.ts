import { describe, it, expect } from 'vitest';
import { ProductListRequestDtoFixture } from '../fixtures';
import { ProductListSearchParamsGenerator } from '../../infrastructure';

describe('ProductListSearchParamsGenerator', () => {
  it('기본 searchParams가 파싱된다', async () => {
    // Given
    const requestDto = ProductListRequestDtoFixture.default;

    // When
    const result = await ProductListSearchParamsGenerator.getSafeSearchParams(requestDto);

    // Then
    expect(result).toMatchObject({
      keyword: '',
      condition: 'pn',
      page: 1,
      category: null,
      opt: null,
    });
  });

  it('category가 Number로 파싱된다', async () => {
    // Given
    const requestDto = ProductListRequestDtoFixture.withCategory;

    // When
    const result = await ProductListSearchParamsGenerator.getSafeSearchParams(requestDto);

    // Then
    expect(result.category).toBeDefined();
    expect(typeof result.category).toBe('number');
  });

  it('opt가 String으로 파싱된다', async () => {
    // Given
    const requestDto = ProductListRequestDtoFixture.withOption;

    // When
    const result = await ProductListSearchParamsGenerator.getSafeSearchParams(requestDto);

    // Then
    expect(result.opt).toBeDefined();
    expect(typeof result.opt).toBe('string');
  });

  it('유효하지 않은 searchParams이 들어오는 경우 기본 searchParams으로 파싱된다', async () => {
    // Given
    const requestDto = ProductListRequestDtoFixture.invalid;

    // When
    const result = await ProductListSearchParamsGenerator.getSafeSearchParams(requestDto);

    // Then
    expect(result).toMatchObject({
      keyword: '',
      condition: 'pn',
      page: 1,
      category: null,
      opt: null,
    });
  });
});
