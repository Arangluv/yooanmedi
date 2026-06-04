import { describe, it, expect } from 'vitest';
import { createPurchasedHistoryEntityFixture } from '../fixtures';
import { PurchasedHistoryMapper } from '../../mapper';
import { purchasedHistoriesSchema, purchasedHistorySchema } from '../../schemas';

describe('Purchased History Mapper', () => {
  it('entity가 Domain으로 파싱된다', () => {
    // Given
    const entity = createPurchasedHistoryEntityFixture();

    // When
    const result = PurchasedHistoryMapper.entityToDomain(entity);

    // Then
    expect(result).toEqual(expect.schemaMatching(purchasedHistorySchema));
    expect(result).not.toBeInstanceOf(Array);
  });

  it('entites가 DomainList로 파싱된다', () => {
    // Given
    const entities = [
      createPurchasedHistoryEntityFixture({ id: 1 }),
      createPurchasedHistoryEntityFixture({ id: 2 }),
      createPurchasedHistoryEntityFixture({ id: 3 }),
    ];

    // When
    const result = PurchasedHistoryMapper.entitiesToDomainList(entities);

    // Then
    expect(result).toEqual(expect.schemaMatching(purchasedHistoriesSchema));
    expect(result.length).toBe(3);
    expect(result).toBeInstanceOf(Array);
  });
});
