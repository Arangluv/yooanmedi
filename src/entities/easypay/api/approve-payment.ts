import 'server-only';
import { PaymentApprovalServiceDto } from '../model/schemas/easypay.payment-approval.schema';

export const approvePayment = async (dto: PaymentApprovalServiceDto) => {
  const res = await fetch(process.env.PAYMENTS_APPROVAL_URL as string, {
    method: 'POST',
    body: JSON.stringify(dto),
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return await res.json();
};
