import { z } from 'zod';

interface NumberSchemaOptions {
  required_message?: string;
  invalid_message?: string;
  min?: number;
  max?: number;
}

export const numberSchema = ({
  required_message,
  invalid_message,
  min,
  max,
}: NumberSchemaOptions) => {
  let schema = z.number({
    error: (iss) => {
      if (iss.input === undefined) {
        return required_message ?? '숫자가 누락되었습니다';
      }

      return invalid_message ?? '숫자 타입이 아닙니다';
    },
  });

  if (min) {
    schema = schema.gte(min, {
      error: () => {
        return `${min} 이상의 숫자를 입력해주세요`;
      },
    });
  }

  if (max) {
    schema = schema.lte(max, {
      error: () => {
        return `${max} 이하의 숫자를 입력해주세요`;
      },
    });
  }

  return schema;
};
