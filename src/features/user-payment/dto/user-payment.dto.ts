import { z } from 'zod';
import { UserPaymentDto, paymentOrderItemSchema } from '../schemas';

// ─── RequestDto ───────────────────────────────────────────────
export type PGPaymentRequestDto = FormData;
export type BankTransferPaymentRequestDto = z.infer<typeof UserPaymentDto.request.bankTransfer>;

// ─── CommandDto ───────────────────────────────────────────────
export type PGPaymentCommandDto = z.infer<typeof UserPaymentDto.command.pg>;
export type BankTransferPaymentCommandDto = z.infer<typeof UserPaymentDto.command.bankTransfer>;
export type PGPaymentCommandResult = {
  approvalDate: string;
  amount: number;
  shopOrderNo: string;
};
export type BankTransferPaymentCommandResult = void;

// ─── User Payment Feature Dto ───────────────────────────────────────────────
export type PaymentOrderItemDto = z.infer<typeof paymentOrderItemSchema>;
