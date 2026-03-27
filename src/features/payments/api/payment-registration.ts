'use server';

import type {
  PaymentsRegisterApplicationDto,
  PaymentsRegisterRequestDto,
} from '../model/schema/payments-register-schema';
import { paymentsRegisterRequestDtoSchema } from '../model/schema/payments-register-schema';

type PaymentRegistrationSuccessResponse = {
  resCd: '0000';
  resMsg: string;
  authPageUrl: string;
};

type PaymentRegistrationFailResponse = {
  resCd: string;
  resMsg: string;
  authPageUrl?: never;
};

export type PaymentRegistrationResult =
  | { success: true; authPageUrl: string }
  | { success: false; message: string };

export const paymentRegistration = async (
  dto: PaymentsRegisterApplicationDto,
): Promise<PaymentRegistrationResult> => {
  try {
    // transform application dto to request dto
    const requestDto: PaymentsRegisterRequestDto = paymentsRegisterRequestDtoSchema.parse({
      ...dto,
      mallId: process.env.PAYMENTS_MID as string,
      shopValueInfo: {
        value1: dto.shopValueInfo.deliveryRequest,
        value2: JSON.stringify(dto.shopValueInfo.orderList),
        value3: dto.shopValueInfo.usedPoint,
        value4: dto.shopValueInfo.userId,
        value5: dto.shopValueInfo.paymentsMethod,
        value6: dto.shopValueInfo.minOrderPrice,
      },
    });

    const res = await fetch(process.env.PAYMENTS_REGISTER_URL as string, {
      method: 'POST',
      body: JSON.stringify(requestDto),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!res.ok) {
      // 이지페이는 에러상태를 반환하지 않는다.
      return {
        success: false,
        message: '네트워크 혹은 서버 오류가 발생했습니다. 다시 시도해주세요',
      };
    }

    const data: PaymentRegistrationSuccessResponse | PaymentRegistrationFailResponse =
      await res.json();

    if (!data?.authPageUrl) {
      return { success: false, message: data.resMsg };
    }

    return { success: true, authPageUrl: data.authPageUrl };
  } catch (error) {
    console.error(error);
    return { success: false, message: '결제창을 불러오는데 실패했습니다. 다시 시도해주세요' };
  }
};
