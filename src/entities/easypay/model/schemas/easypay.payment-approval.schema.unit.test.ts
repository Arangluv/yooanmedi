import { describe, it, expect } from 'vitest';
import { toPaymentApprovalServiceDto } from './easypay.payment-approval.schema';

describe('toPaymentApprovalServiceDto', () => {
  it('RequestDto가 ServiceDto로 변환된다', () => {
    const requestDto = {
      authorizationId: '12345678901234567890',
      shopOrderNo: '123456789012345',
    };

    const serviceDto = toPaymentApprovalServiceDto(requestDto);
    expect(serviceDto).toBeDefined();
    expect(serviceDto.shopTransactionId).toBeDefined();
    expect(serviceDto.approvalReqDate).toBeDefined();
    expect(serviceDto.mallId).toBeDefined();
  });
});
