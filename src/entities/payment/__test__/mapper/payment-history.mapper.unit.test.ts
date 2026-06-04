import { describe, it, expect } from 'vitest';
import { basePaymentHistoryEntityFixture } from '../fixtures';
import { PaymentHistoryMapper } from '../../mapper';
import { paymentHistorySchema } from '../../schemas';

describe('Payment History Mapper', () => {
  describe('entityToDomain', () => {
    it('파싱에 성공한다', () => {
      // Given
      const entity = basePaymentHistoryEntityFixture;

      // When
      const result = PaymentHistoryMapper.entityToDomain(entity);

      // Then
      expect(result).toEqual(expect.schemaMatching(paymentHistorySchema));
    });
  });
});
