import { numberSchema as numberSchemaBase } from './number.schema';
import { z } from 'zod';

interface BaseSchemaOptions {
  required_message?: string;
  invalid_message?: string;
}
interface NumberSchemaOptions extends BaseSchemaOptions {
  min?: number;
  max?: number;
}

export const urlSchema = z.url({
  error: (iss) => {
    if (iss.code == 'invalid_type' && iss.input === undefined) {
      return 'URL이 누락되었습니다.';
    }

    if (iss.code === 'invalid_format') {
      return '유효하지 않은 URL 형식입니다.';
    }

    return '유효하지 않은 URL입니다.';
  },
});

export const collectionIdSchema = (options: BaseSchemaOptions) =>
  numberSchemaBase({
    required_message: options.required_message,
    invalid_message: options.invalid_message,
  });

export const numberSchema = (options: NumberSchemaOptions) =>
  numberSchemaBase({
    required_message: options.required_message,
    invalid_message: options.invalid_message,
    min: options.min,
    max: options.max,
  });

export const payloadImageSchema = z.object({
  id: z.number(),
  url: urlSchema,
  filename: z.string(),
});
export type PayloadImage = z.infer<typeof payloadImageSchema>;
