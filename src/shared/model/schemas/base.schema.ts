import { stringSchema } from './string.schema';
import { numberSchema } from './number.schema';

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
  orderNo: stringSchema({
    required_message: '주문 번호는 비어있을 수 없습니다.',
    invalid_message: '유효하지 않은 주문 번호입니다.',
    length: 15,
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
