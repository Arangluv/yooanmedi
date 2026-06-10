import { z } from 'zod';
import {
  EasyPayRegistrationSchemas,
  EasyPayPaymentApprovalSchemas,
  EasyPayPaymentCancelSchemas,
} from '../schemas';

// ─── 결제등록 ───────────────────────────────────────────────
export type EasyPayRegisterTransactionRequestEntity = z.infer<
  typeof EasyPayRegistrationSchemas.requestEntity
>;
export type EasyPayRegisterTransactionResult = z.infer<typeof EasyPayRegistrationSchemas.result>;

// ─── 결제승인 ───────────────────────────────────────────────
export type EasyPayPaymentApprovalRequestEntity = z.infer<
  typeof EasyPayPaymentApprovalSchemas.requestEntity
>;
export type EasyPayPaymentApprovalResult = z.infer<typeof EasyPayPaymentApprovalSchemas.result>;

// ─── 결제취소 ───────────────────────────────────────────────
export type EasyPayPaymentCancelRequestEntity = z.infer<
  typeof EasyPayPaymentCancelSchemas.requestEntity
>;
export type EasyPayPaymentCancelResult = z.infer<typeof EasyPayPaymentCancelSchemas.result>;
