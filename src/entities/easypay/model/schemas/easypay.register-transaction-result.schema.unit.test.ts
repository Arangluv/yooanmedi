import { describe, it, expect } from 'vitest';
import { ValidateTransactionRegistrationResultFixture } from '../../__test__/easypay.fixture';
import {
  toTransactionRegistrationServiceResult,
  registerTransactionSuccessResultSchema,
  registerTransactionFailureResultSchema,
} from './easypay.register-transaction-result.schema';

describe('easypayRegisterTransactionResultSchema', () => {
  it('이지페이 거래등록 성공 시 success result를 반환한다', () => {
    const result = toTransactionRegistrationServiceResult(
      ValidateTransactionRegistrationResultFixture.successRequestDto as any,
    );
    expect(result).toEqual(expect.schemaMatching(registerTransactionSuccessResultSchema));
  });

  it('이지페이 거래등록 실패시 failure result를 반환한다', () => {
    const result = toTransactionRegistrationServiceResult(
      ValidateTransactionRegistrationResultFixture.failureResult as any,
    );
    expect(result).toEqual(expect.schemaMatching(registerTransactionFailureResultSchema));
  });
});
