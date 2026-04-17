import { describe, it, expect } from 'vitest';
import {
  toTransactionRegistrationServiceResult,
  registerTransactionSuccessResultSchema,
  registerTransactionFailureResultSchema,
} from './easypay.register-transaction-result.schema';

describe('easypayRegisterTransactionResultSchema', () => {
  it('이지페이 결제 등록 성공 시 isRegistrationSuccess는 true, Success 데이터 스키마와 일치한다', () => {
    const dto = {
      resCd: '0000',
      resMsg: '정상',
      authorizationId: '26041515173710881550',
      shopOrderNo: '202604159300512',
      shopValue1: '',
      shopValue2:
        '[{"product":{"id":1684,"price":2000},"quantity":1},{"product":{"id":1683,"price":2000},"quantity":1},{"product":{"id":1681,"price":2000},"quantity":1}]',
      shopValue3: '0',
      shopValue4: '3',
      shopValue5: 'creditCard',
      shopValue6: '30000',
    };

    const result = toTransactionRegistrationServiceResult(dto);
    expect(result).toBeDefined();
    expect(result.isRegistrationSuccess).toBe(true);
    expect(result).toEqual(expect.schemaMatching(registerTransactionSuccessResultSchema));
  });

  it('이지페이 결제 등록 실패 시 isRegistrationSuccess는 false, Failure 데이터 스키마와 일치한다', () => {
    const dto = {
      resCd: '9999',
      resMsg: 'some easypay error message',
    };

    const result = toTransactionRegistrationServiceResult(dto);
    expect(result).toBeDefined();
    expect(result.isRegistrationSuccess).toBe(false);
    expect(result).toEqual(expect.schemaMatching(registerTransactionFailureResultSchema));
  });
});
