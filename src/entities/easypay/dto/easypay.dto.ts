import { z } from 'zod';
import {
  EasyPayRegistrationSchemas,
  EasyPayPaymentAuthenticationSchemas,
  EasyPayPaymentApprovalSchemas,
  EasyPayPaymentCancelSchemas,
} from '../schemas';

export type EasyPayRegisterTransactionRequestDto = z.infer<
  typeof EasyPayRegistrationSchemas.requestDto
>;

export type EasyPayPaymentAuthenticationDto = z.infer<
  typeof EasyPayPaymentAuthenticationSchemas.dto
>;

export type EasyPayApprovePaymentRequestDto = z.infer<
  typeof EasyPayPaymentApprovalSchemas.requestDto
>;

export type EasyPayPaymentCancelRequestDto = z.infer<typeof EasyPayPaymentCancelSchemas.requestDto>;
