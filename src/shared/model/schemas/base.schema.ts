import { z } from 'zod';

interface BaseSchemaOptions {
  required_message?: string;
  invalid_message?: string;
}

interface NumberSchemaOptions extends BaseSchemaOptions {
  min?: number;
  max?: number;
}

interface StringSchemaOptions {
  required_message?: string;
  invalid_message?: string;
  minLength?: number;
  maxLength?: number;
  length?: number;
}

export const url = z.url({
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

export const collectionId = (options: BaseSchemaOptions) =>
  number({
    required_message: options.required_message,
    invalid_message: options.invalid_message,
  });

export const string = ({
  required_message = '문자열이 누락되었습니다',
  invalid_message = '문자열 타입이 아닙니다',
  minLength,
  maxLength,
  length,
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

export const number = ({ required_message, invalid_message, min, max }: NumberSchemaOptions) => {
  let schema = z.number({
    error: (iss) => {
      if (iss.input === undefined) {
        return required_message ?? '숫자가 누락되었습니다';
      }

      return invalid_message ?? '숫자 타입이 아닙니다';
    },
  });

  if (min !== undefined) {
    schema = schema.gte(min, {
      error: () => {
        return `${min} 이상의 숫자를 입력해주세요.`;
      },
    });
  }

  if (max !== undefined) {
    schema = schema.lte(max, {
      error: () => {
        return `${max} 이하의 숫자를 입력해주세요`;
      },
    });
  }

  return schema;
};

export const payloadImage = z.object({
  id: z.number(),
  url: url,
  filename: z.string(),
});
export type PayloadImage = z.infer<typeof payloadImage>;
