import { describe, it, expect } from 'vitest';
import {
  toPaymentApprovalServiceDto,
  toPaymentApprovalResult,
  paymentApprovalServiceSchema,
  paymentApprovalSuccessResultSchema,
  paymentApprovalFailureResultSchema,
} from './easypay.payment-approval.schema';
import { PaymentApprovalFixture } from '../../__test__/easypay.fixture';

describe('toPaymentApprovalServiceDto', () => {
  it('RequestDto가 ServiceDto로 변환된다', () => {
    const result = toPaymentApprovalServiceDto(PaymentApprovalFixture.requestDto);
    expect(result).toEqual(expect.schemaMatching(paymentApprovalServiceSchema));
  });

  it('이지페이 결제승인 요청 성공시 successResult를 반환한다', () => {
    const result = toPaymentApprovalResult(PaymentApprovalFixture.successResult);
    expect(result).toEqual(expect.schemaMatching(paymentApprovalSuccessResultSchema));
  });

  it('이지페이 결제승인 요청 실패시 failureResult를 반환한다', () => {
    const result = toPaymentApprovalResult(PaymentApprovalFixture.failureResult);
    expect(result).toEqual(expect.schemaMatching(paymentApprovalFailureResultSchema));
  });
});
