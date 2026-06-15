import { BaseError } from '@/shared';
import { EasyPayResultHandler } from '../libs';
import {
  EasyPayRegisterTransactionRequestEntity,
  EasyPayPaymentApprovalRequestEntity,
  EasyPayPaymentCancelRequestEntity,
  EasyPayRegisterTransactionApiSuccessResponse,
  EasyPayRegisterTransactionApiResponse,
  EasyPayRegisterTransactionResponse,
  EasyPayPaymentApprovalApiResponse,
  EasyPayPaymentApprovalApiSuccessResponse,
  EasyPayPaymentApprovalResponse,
  EasyPayPaymentCancelApiResponse,
  EasyPayPaymentCancelApiSuccessResponse,
  EasyPayPaymentCancelResponse,
} from '../../types';
import { EasyPayError } from '../../core';
import { EasyPayMapper } from '../../mapper';

const EASYPAY_SUCCESS_RES_CODE = '0000';

export const EasyPayAdapter = () => ({
  registerTransaction: async (
    entity: EasyPayRegisterTransactionRequestEntity,
  ): Promise<EasyPayRegisterTransactionResponse> => {
    try {
      const res = await fetch(process.env.PAYMENTS_REGISTER_URL as string, {
        method: 'POST',
        body: JSON.stringify(entity),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw EasyPayError.networkError();
      }

      const easypayResponse = (await res.json()) as EasyPayRegisterTransactionApiResponse;

      if (easypayResponse.resCd !== EASYPAY_SUCCESS_RES_CODE) {
        throw EasyPayError.registerFail(easypayResponse.resMsg);
      }

      const result = EasyPayMapper.toRegistrationResult(
        easypayResponse as EasyPayRegisterTransactionApiSuccessResponse,
      );
      return EasyPayResultHandler.ok(result);
    } catch (error) {
      if (error instanceof BaseError) {
        return EasyPayResultHandler.fail(error);
      }
      return EasyPayResultHandler.fail(EasyPayError.registerFail());
    }
  },

  approvePayment: async (
    entity: EasyPayPaymentApprovalRequestEntity,
  ): Promise<EasyPayPaymentApprovalResponse> => {
    try {
      const res = await fetch(process.env.PAYMENTS_APPROVAL_URL as string, {
        method: 'POST',
        body: JSON.stringify(entity),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw EasyPayError.networkError();
      }

      const easypayResponse = (await res.json()) as EasyPayPaymentApprovalApiResponse;
      if (easypayResponse.resCd !== EASYPAY_SUCCESS_RES_CODE) {
        throw EasyPayError.approveFail(easypayResponse.resMsg);
      }

      const result = EasyPayMapper.toApprovalResult(
        easypayResponse as EasyPayPaymentApprovalApiSuccessResponse,
      );
      return EasyPayResultHandler.ok(result);
    } catch (error) {
      if (error instanceof BaseError) {
        return EasyPayResultHandler.fail(error);
      }
      return EasyPayResultHandler.fail(EasyPayError.approveFail());
    }
  },

  cancelPayment: async (
    entity: EasyPayPaymentCancelRequestEntity,
  ): Promise<EasyPayPaymentCancelResponse> => {
    try {
      const res = await fetch(process.env.PAYMENTS_CANCEL_URL as string, {
        method: 'POST',
        body: JSON.stringify(entity),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        throw EasyPayError.networkError();
      }

      const easypayResponse = (await res.json()) as EasyPayPaymentCancelApiResponse;
      if (easypayResponse.resCd !== EASYPAY_SUCCESS_RES_CODE) {
        throw EasyPayError.cancelFail(easypayResponse.resMsg);
      }

      const result = EasyPayMapper.toCancelResult(
        easypayResponse as EasyPayPaymentCancelApiSuccessResponse,
      );
      return EasyPayResultHandler.ok(result);
    } catch (error) {
      if (error instanceof BaseError) {
        return EasyPayResultHandler.fail(error);
      }
      return EasyPayResultHandler.fail(EasyPayError.cancelFail());
    }
  },
});
