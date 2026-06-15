import { describe, it, expect } from 'vitest';
import { PAYMENTS_METHOD } from '@/shared';
import { EasyPayPaymentAuthenticationSchemas } from '@/entities/easypay';
import { EasyPayFixtureUtil } from '@/entities/easypay/__test__';
import { PaymentFixtures } from '../fixtures';
import { PaymentCommandHelper } from '../../infrastructure';
import { UserPaymentDto } from '../../schemas';

describe('PaymentCommandHelper', () => {
  describe('toPaymentAuthResult', () => {
    it('FormData가 PaymentAuthResult로 파싱된다', () => {
      // Given
      const requestDto = PaymentFixtures.request.pg;

      // When
      const result = PaymentCommandHelper.toPaymentAuthResult(requestDto);

      // Then
      expect(result).toEqual(expect.schemaMatching(EasyPayPaymentAuthenticationSchemas.dto));
    });
  });

  describe('createBankTransferCommandDto', () => {
    it('BankTransferPaymentCommandDto로 파싱된다', () => {
      // Given
      const requestDto = PaymentFixtures.request.bank;

      // When
      const result = PaymentCommandHelper.createBankTransferCommandDto(requestDto);

      // Then
      expect(result).toEqual(expect.schemaMatching(UserPaymentDto.command.bankTransfer));
    });
  });
});
