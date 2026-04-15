import { z } from 'zod';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { PaymentsBaseSchema } from '@/shared/model/schemas/payments.base.schema';

const easypayRegisterTransactionSuccessResultSchema = z
  .object({
    resCd: z.literal(EASYPAY_CONFIG.successResponseCode),
    resMsg: z.string(),
    authorizationId: z.string(),
    shopOrderNo: PaymentsBaseSchema.orderNo,
    shopValue1: PaymentsBaseSchema.deliveryRequest,
    shopValue2: z
      .string()
      .refine(
        (val) => {
          try {
            JSON.parse(val);
            return true;
          } catch (error) {
            return false;
          }
        },
        { message: '유효하지 않은 JSON 형식입니다.' },
      )
      .transform((val) => JSON.parse(val))
      .pipe(PaymentsBaseSchema.orderList),
    shopValue3: z
      .string()
      .refine((val) => !isNaN(Number(val)), { message: '숫자 형식이 아닙니다' })
      .transform((val) => Number(val)),
    shopValue4: z
      .string()
      .refine((val) => !isNaN(Number(val)), { message: '숫자 형식이 아닙니다' })
      .transform((val) => Number(val)),
    shopValue5: PaymentsBaseSchema.paymentsMethodUsedCard,
    shopValue6: z
      .string()
      .refine((val) => !isNaN(Number(val)), { message: '숫자 형식이 아닙니다' })
      .transform((val) => Number(val)),
  })
  .transform((data) => ({
    ...data,
    isRegistrationSuccess: true as const,
  }));

const easypayRegisterTransactionFailResultSchema = z
  .object({
    resCd: z.string().refine((val) => val !== EASYPAY_CONFIG.successResponseCode, {
      message: '올바르지 않은 응답 코드입니다.',
    }),
    resMsg: z.string(),
  })
  .transform((data) => ({
    ...data,
    isRegistrationSuccess: false as const,
  }));

export const easypayRegisterTransactionResultSchema = z.union([
  easypayRegisterTransactionSuccessResultSchema,
  easypayRegisterTransactionFailResultSchema,
]);

export type EasypayRegisterTransactionRawResult = z.input<
  typeof easypayRegisterTransactionResultSchema
>;
export type EasypayRegisterTransactionValidatedResult = z.infer<
  typeof easypayRegisterTransactionResultSchema
>;
