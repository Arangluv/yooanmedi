'use server';

import { ApprovalPaymentRequestDto } from '../model/schema/payments-approval-schema';

export const paymentsApproval = async (dto: ApprovalPaymentRequestDto) => {
  const res = await fetch(process.env.PAYMENTS_APPROVAL_URL as string, {
    method: 'POST',
    body: JSON.stringify(dto),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    throw new Error('결제 승인 요청 처리 과정에서 문제가 발생했습니다');
  }

  return await res.json();
};
