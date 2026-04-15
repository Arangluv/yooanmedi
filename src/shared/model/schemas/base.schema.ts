import { stringSchema } from './string.schema';
import { numberSchema } from './number.schema';
import { EASYPAY_CONFIG } from '@/shared/config/easypay.config';
import { z } from 'zod';

interface BaseSchemaOptions {
  required_message?: string;
  invalid_message?: string;
}

interface NumberSchemaOptions extends BaseSchemaOptions {
  min?: number;
  max?: number;
}

interface StringSchemaOptions extends BaseSchemaOptions {
  minLength?: number;
  maxLength?: number;
  length?: number;
}

export const BaseSchema = {
  pgCno: stringSchema({
    required_message: 'PG 주문번호는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 PG 주문번호입니다.',
    length: 20,
  }),


  url: z.url({
    error: (iss) => {
      if (iss === undefined) {
        return 'URL이 누락되었습니다.';
      }

      if (iss.code === 'invalid_type') {
        return '유효하지 않은 URL 타입입니다.';
      }

      if (iss.code === 'invalid_format') {
        return '유효하지 않은 URL 형식입니다.';
      }

      return '유효하지 않은 URL입니다.';
    },
  }),
  collectionId: (options: BaseSchemaOptions) =>
    numberSchema({
      required_message: options.required_message,
      invalid_message: options.invalid_message,
    }),
  number: (options: NumberSchemaOptions) =>
    numberSchema({
      required_message: options.required_message,
      invalid_message: options.invalid_message,
    }),
};
