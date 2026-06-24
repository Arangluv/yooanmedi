import moment from 'moment';
import crypto from 'crypto';
import {
  EASYPAY_CONFIG,
  generate15digitsNumberBasedOnDate,
  generateUUID32digits,
  getNowYYYYMMDD,
  PAYMENTS_METHOD,
  ZodSchemaParser,
} from '@/shared';
import {
  // response
  EasyPayRegisterTransactionApiSuccessResponse,
  EasyPayPaymentApprovalApiSuccessResponse,
  EasyPayPaymentCancelApiSuccessResponse,
  // result
  EasyPayPaymentApprovalResult,
  EasyPayRegisterTransactionResult,
  EasyPayPaymentCancelResult,
  // request entity
  EasyPayRegisterTransactionRequestEntity,
  EasyPayPaymentApprovalRequestEntity,
  EasyPayPaymentCancelRequestEntity,
  EasyPayPaymentAuthenticationResponse,
} from '../types';
import {
  EasyPayPaymentApprovalSchemas,
  EasyPayRegistrationSchemas,
  EasyPayPaymentCancelSchemas,
  EasyPayPaymentAuthenticationSchemas,
} from '../schemas';
import {
  EasyPayRegisterTransactionRequestDto,
  EasyPayApprovePaymentRequestDto,
  EasyPayPaymentCancelRequestDto,
  EasyPayPaymentAuthenticationDto,
} from '../dto';

export class EasyPayMapper {
  static toAuthenticationDto(
    response: EasyPayPaymentAuthenticationResponse,
  ): EasyPayPaymentAuthenticationDto {
    return ZodSchemaParser.safeParseOrThrow(EasyPayPaymentAuthenticationSchemas.dto, {
      data: {
        authorizationId: response.authorizationId,
        shopOrderNo: response.shopOrderNo,
        deliveryRequest: response.shopValue1,
        orderList: JSON.parse(response.shopValue2),
        usedPoint: parseInt(response.shopValue3),
        userId: parseInt(response.shopValue4),
        paymentMethod: response.shopValue5,
        minOrderPrice: parseInt(response.shopValue6),
      } as EasyPayPaymentAuthenticationDto,
      errorMsg: '잘못된 결제인증 정보입니다',
    });
  }

  static toRegistrationRequestEntity(
    dto: EasyPayRegisterTransactionRequestDto,
  ): EasyPayRegisterTransactionRequestEntity {
    return ZodSchemaParser.safeParseOrThrow(EasyPayRegistrationSchemas.requestEntity, {
      data: {
        mallId: process.env.PAYMENTS_MID,
        returnUrl: EASYPAY_CONFIG.returnUrl,
        amount: dto.amount,
        orderInfo: dto.orderInfo,
        clientTypeCode: EASYPAY_CONFIG.clientTypeCode,
        payMethodTypeCode: EASYPAY_CONFIG.payMethodTypeCode,
        currency: EASYPAY_CONFIG.currency,
        deviceTypeCode: EASYPAY_CONFIG.deviceTypeCode,
        shopOrderNo: generate15digitsNumberBasedOnDate(),
        shopValueInfo: {
          value1: dto.shopValueInfo.deliveryRequest,
          value2: JSON.stringify(dto.shopValueInfo.orderList),
          value3: dto.shopValueInfo.usedPoint,
          value4: dto.shopValueInfo.userId,
          value5: PAYMENTS_METHOD.credit_card,
          value6: dto.shopValueInfo.minOrderPrice,
        },
      } as EasyPayRegisterTransactionRequestEntity,
      errorMsg: '잘못된 결제등록 데이터입니다',
    });
  }

  static toApprovePaymentRequestEntity(
    dto: EasyPayApprovePaymentRequestDto,
  ): EasyPayPaymentApprovalRequestEntity {
    return ZodSchemaParser.safeParseOrThrow(EasyPayPaymentApprovalSchemas.requestEntity, {
      data: {
        mallId: process.env.PAYMENTS_MID,
        shopTransactionId: generateUUID32digits(),
        approvalReqDate: getNowYYYYMMDD(),
        authorizationId: dto.authorizationId,
        shopOrderNo: dto.shopOrderNo,
      } as EasyPayPaymentApprovalRequestEntity,
      errorMsg: '잘못된 결제등록 데이터입니다',
    });
  }

  static toPartialCancelRequestEntity(
    dto: EasyPayPaymentCancelRequestDto,
  ): EasyPayPaymentCancelRequestEntity {
    const shopTransactionId = generateUUID32digits();
    const authMsg = `${dto.pgCno}|${shopTransactionId}`;
    const hashedAuthMsg = crypto
      .createHmac('sha256', process.env.PAYMENTS_MSG_AUTH_VALUE as string)
      .update(authMsg)
      .digest('hex');

    return ZodSchemaParser.safeParseOrThrow(EasyPayPaymentCancelSchemas.requestEntity, {
      data: {
        mallId: process.env.PAYMENTS_MID,
        pgCno: dto.pgCno,
        amount: dto.amount,
        shopTransactionId,
        msgAuthValue: hashedAuthMsg,
        reviseTypeCode: EASYPAY_CONFIG.cancelReviseType.partial,
        cancelReqDate: moment.tz('Asia/Seoul').format('YYYYMMDD'),
      } as EasyPayPaymentCancelRequestEntity,
      errorMsg: '잘못된 결제등록 데이터입니다',
    });
  }

  static toTotalCancelRequestEntity(
    dto: EasyPayPaymentCancelRequestDto,
  ): EasyPayPaymentCancelRequestEntity {
    const shopTransactionId = generateUUID32digits();
    const authMsg = `${dto.pgCno}|${shopTransactionId}`;
    const hashedAuthMsg = crypto
      .createHmac('sha256', process.env.PAYMENTS_MSG_AUTH_VALUE as string)
      .update(authMsg)
      .digest('hex');

    return ZodSchemaParser.safeParseOrThrow(EasyPayPaymentCancelSchemas.requestEntity, {
      data: {
        mallId: process.env.PAYMENTS_MID,
        pgCno: dto.pgCno,
        amount: dto.amount,
        shopTransactionId,
        msgAuthValue: hashedAuthMsg,
        reviseTypeCode: EASYPAY_CONFIG.cancelReviseType.total,
        cancelReqDate: moment.tz('Asia/Seoul').format('YYYYMMDD'),
      } as EasyPayPaymentCancelRequestEntity,
      errorMsg: '잘못된 결제등록 데이터입니다',
    });
  }

  static toRegistrationResult(
    response: EasyPayRegisterTransactionApiSuccessResponse,
  ): EasyPayRegisterTransactionResult {
    return ZodSchemaParser.safeParseOrThrow(EasyPayRegistrationSchemas.result, {
      data: {
        authPageUrl: response.authPageUrl,
      } as EasyPayRegisterTransactionResult,
      errorMsg: '잘못된 이지페이 결제등록결과 데이터입니다',
    });
  }

  static toApprovalResult(response: EasyPayPaymentApprovalApiSuccessResponse) {
    return ZodSchemaParser.safeParseOrThrow(EasyPayPaymentApprovalSchemas.result, {
      data: {
        mallId: response.mallId,
        pgCno: response.pgCno,
        shopOrderNo: response.shopOrderNo,
        shopTransactionId: response.shopTransactionId,
        statusCode: response.statusCode,
        statusMessage: response.statusMessage,
        msgAuthValue: response.msgAuthValue,
        escrowUsed: response.escrowUsed,
        amount: response.amount,
        transactionDate: response.transactionDate,
        paymentInfo: response.paymentInfo,
      } as EasyPayPaymentApprovalResult,
      errorMsg: '잘못된 결제승인 데이터 입니다',
    });
  }

  static toCancelResult(
    response: EasyPayPaymentCancelApiSuccessResponse,
  ): EasyPayPaymentCancelResult {
    return ZodSchemaParser.safeParseOrThrow(EasyPayPaymentCancelSchemas.result, {
      data: {
        cancelPgCno: response.cancelPgCno,
      } as EasyPayPaymentCancelResult,
      errorMsg: '잘못된 결제취소결과 데이터 입니다',
    });
  }
}
