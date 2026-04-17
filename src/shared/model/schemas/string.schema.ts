import { z } from 'zod';

interface StringSchemaOptions {
  required_message?: string;
  invalid_message?: string;
  minLength?: number;
  maxLength?: number;
  length?: number;
  isOptional?: boolean;
}

export const stringSchema = ({
  required_message = '문자열이 누락되었습니다',
  invalid_message = '문자열 타입이 아닙니다',
  minLength,
  maxLength,
  length,
  isOptional = false,
}: StringSchemaOptions) => {
  let schema = z.string({
    error: (iss) => {
      if (iss.input === undefined) {
        return required_message;
      }
      return invalid_message;
    },
  });

  if (minLength) {
    schema = schema.min(minLength, {
      error: () => {
        return `${minLength} 이상의 문자열이어야 합니다`;
      },
    });
  }

  if (maxLength) {
    schema = schema.max(maxLength, {
      error: () => {
        return `${maxLength} 이하의 문자열이어야 합니다`;
      },
    });
  }

  if (length) {
    schema = schema.length(length, {
      error: () => {
        return `${length} 자리의 문자열이어야 합니다`;
      },
    });
  }

  return schema;
};
