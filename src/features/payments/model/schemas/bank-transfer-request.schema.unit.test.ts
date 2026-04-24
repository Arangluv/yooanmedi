import { describe, it, expect } from 'vitest';
import { bankTransferRequestSchema } from './bank-transfer-request.schema';
import { bankTransferRequestDtoFixture } from '../../__test__/payments.fixture';

describe('bankTransferRequestSchema', () => {
  it('스키마 파싱에 성공한다', () => {
    const result = bankTransferRequestSchema.safeParse(bankTransferRequestDtoFixture);

    expect(result.success).toBe(true);
    expect(result.data).toEqual(expect.schemaMatching(bankTransferRequestSchema));
  });
});
