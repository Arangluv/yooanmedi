import { z } from 'zod';
import { BaseError } from '@/shared';
import {
  EasyPayRegistrationSchemas,
  EasyPayPaymentApprovalSchemas,
  EasyPayPaymentCancelSchemas,
  EasyPayPaymentAuthenticationSchemas,
} from '../schemas';
import {
  EasyPayRegisterTransactionResult,
  EasyPayPaymentApprovalResult,
  EasyPayPaymentCancelResult,
} from './easypay.type';

// ─── 이지페이 Adapter Response ───────────────────────────────────────────────
export interface EasyPayAdapterSuccessResult<TData> {
  ok: true;
  data: TData;
}
export interface EasyPayAdapterFailureResult {
  ok: false;
  error: BaseError;
}
export type EasyPayAdapterResult<TData> =
  | EasyPayAdapterSuccessResult<TData>
  | EasyPayAdapterFailureResult;

// ─── 결제승인 요청 ───────────────────────────────────────────────
export type EasyPayRegisterTransactionApiSuccessResponse = z.infer<
  typeof EasyPayRegistrationSchemas.apiSuccessResponse
>;

export type EasyPayRegisterTransactionApiFailureResponse = z.infer<
  typeof EasyPayRegistrationSchemas.apiFailureResponse
>;

export type EasyPayRegisterTransactionApiResponse =
  | EasyPayRegisterTransactionApiSuccessResponse
  | EasyPayRegisterTransactionApiFailureResponse;

export type EasyPayRegisterTransactionResponse =
  EasyPayAdapterResult<EasyPayRegisterTransactionResult>;

// ─── 결제등록 검증 ───────────────────────────────────────────────
export type EasyPayPaymentAuthenticationResponse = z.infer<
  typeof EasyPayPaymentAuthenticationSchemas.response
>;

// ─── 결제승인 요청 ───────────────────────────────────────────────
export type EasyPayPaymentApprovalApiSuccessResponse = z.infer<
  typeof EasyPayPaymentApprovalSchemas.apiSuccessResponse
>;

export type EasyPayPaymentApprovalApiFailureResponse = z.infer<
  typeof EasyPayPaymentApprovalSchemas.apiFailureResponse
>;

export type EasyPayPaymentApprovalApiResponse =
  | EasyPayPaymentApprovalApiSuccessResponse
  | EasyPayPaymentApprovalApiFailureResponse;

export type EasyPayPaymentApprovalResponse = EasyPayAdapterResult<EasyPayPaymentApprovalResult>;

// ─── 결제취소 요청 ───────────────────────────────────────────────
export type EasyPayPaymentCancelApiSuccessResponse = z.infer<
  typeof EasyPayPaymentCancelSchemas.apiSuccessResponse
>;
export type EasyPayPaymentCancelApiFailureResponse = z.infer<
  typeof EasyPayPaymentCancelSchemas.apiFailureResponse
>;
export type EasyPayPaymentCancelApiResponse =
  | EasyPayPaymentCancelApiSuccessResponse
  | EasyPayPaymentCancelApiFailureResponse;

export type EasyPayPaymentCancelResponse = EasyPayAdapterResult<EasyPayPaymentCancelResult>;
