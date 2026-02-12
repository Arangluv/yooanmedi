'use server';

import {
  paymentsApprovalRequestSchema,
  paymentsApprovalResponseSchema,
} from '../model/payments-approval-schema';

export const paymentsApproval = async ({
  authorizationId,
  shopOrderNo,
}: {
  authorizationId: string;
  shopOrderNo: string;
}) => {
  try {
    const dto = paymentsApprovalRequestSchema.parse({
      mallId: process.env.PAYMENTS_MID as string,
      authorizationId: authorizationId,
      shopOrderNo: shopOrderNo,
    });

    const res = await fetch(process.env.PAYMENTS_APPROVAL_URL as string, {
      method: 'POST',
      body: JSON.stringify(dto),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await res.json();

    if (!res.ok) {
      throw new Error('결제 승인요청 실패', { cause: { code: responseData.resCd } });
    }

    const result = paymentsApprovalResponseSchema.parse(responseData);

    return result;
  } catch (error) {
    throw error;
  }
};
