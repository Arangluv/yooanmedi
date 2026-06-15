import { describe, it, expect } from 'vitest';
import { PAYMENTS_METHOD } from '@/shared';
import { EasyPayPaymentAuthenticationSchemas } from '@/entities/easypay';
import { EasyPayFixtureUtil } from '@/entities/easypay/__test__';
import { PaymentCommandHelper } from '../../infrastructure';

describe('PaymentCommandHelper', () => {
  describe('toPaymentAuthResult', () => {
    it('FormData가 PaymentAuthResult로 파싱된다', () => {
      // Given
      const formData = new FormData();
      formData.append('authorizationId', EasyPayFixtureUtil.generateAuthorizationId());
      formData.append('shopOrderNo', EasyPayFixtureUtil.generateShopOrderNo());
      formData.append('shopValue1', '테스트 요청사항');
      formData.append(
        'shopValue2',
        '[{"product":{"id":1,"price":3000},"quantity":3},{"product":{"id":2,"price":2300},"quantity":2},{"product":{"id":3,"price":2000},"quantity":1}]',
      );
      formData.append('shopValue3', '2300');
      formData.append('shopValue4', '1');
      formData.append('shopValue5', PAYMENTS_METHOD.credit_card);
      formData.append('shopValue6', '30000');

      // When
      const result = PaymentCommandHelper.toPaymentAuthResult(formData);

      // Then
      expect(result).toEqual(expect.schemaMatching(EasyPayPaymentAuthenticationSchemas.dto));
    });
  });

  describe('createBankTransferCommandDto', () => {
    it('FormData가 PaymentAuthResult로 파싱된다', () => {
      // PointAllocator --> 테스트코드를 작성해야한다

      // Given
      const requestDto = '' as any;

      // When
      const result = PaymentCommandHelper.createBankTransferCommandDto('ASD' as any);

      // Then
    });
  });
});
