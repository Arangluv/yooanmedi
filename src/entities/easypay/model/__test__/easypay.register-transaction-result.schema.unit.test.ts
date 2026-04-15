import { describe, it, expect } from 'vitest';
import { easypayRegisterTransactionResultSchema } from '../schemas/easypay.register-transaction-result.schema';

describe('easypayRegisterTransactionResultSchema', () => {
  it('성공 시 isRegistrationSuccess true와 함께 데이터 필드가 있는 객체를 반환한다', () => {
    const dto = {
      shopValue2:
        '[{"product":{"id":1684,"price":2000},"quantity":1},{"product":{"id":1683,"price":2000},"quantity":1},{"product":{"id":1681,"price":2000},"quantity":1}]',
      resCd: '0000',
      authorizationId: '26041515173710881550',
      shopValue1: '',
      shopValue4: '3',
      shopValue3: '0',
      shopValue6: '30000',
      shopValue5: 'creditCard',
      resMsg: '정상',
      shopOrderNo: '202604159300512',
    };

    const result = easypayRegisterTransactionResultSchema.safeParse(dto);

    expect(result.data).toBeDefined();
    expect((result as any).data?.isRegistrationSuccess).toBe(true);
    expect((result as any).data?.resCd).toBe('0000');
    expect((result as any).data?.resMsg).toBe('정상');
    expect((result as any).data?.authorizationId).toBeDefined();
    expect((result as any).data?.shopOrderNo).toBeDefined();
    expect((result as any).data?.shopValue1).toBeDefined();
    expect((result as any).data?.shopValue2).toBeDefined();
    expect((result as any).data?.shopValue3).toBeDefined();
    expect((result as any).data?.shopValue4).toBeDefined();
    expect((result as any).data?.shopValue5).toBeDefined();
    expect((result as any).data?.shopValue6).toBeDefined();
  });

  it('dto가 올바르지 않을 시 zod 에러를 반환한다', () => {
    const dto = {
      shopValue2:
        '[{"product":{"id":1684,"price":2000},"quantity":1},{"product":{"id":1683,"price":2000},"quantity":1},{"product":{"id":1681,"price":2000},"quanti:1}]',
      resCd: '0000',
      authorizationId: '26041515173710881550',
      shopValue1: '',
      shopValue4: '3',
      shopValue3: '0',
      shopValue6: 'asd',
      shopValue5: 'creditCard',
      resMsg: '정상',
      shopOrderNo: '202604159300512',
    };

    const result = easypayRegisterTransactionResultSchema.safeParse(dto);

    expect(result.success).toBe(false);
    expect(result.error).toBeDefined();
  });
});
