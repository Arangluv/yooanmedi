import { zodSafeParse } from '@/shared/lib/zod';
import { describe, it, expect } from 'vitest';
import { z } from 'zod';

const _successSchema = z.object({
  resCd: z.literal('9999'),
  resMsg: z.string(),
  a: z.string(),
  b: z.string(),
  c: z.string(),
});

const successSchema = z.object({
  resCd: z.literal('9999'),
  resMsg: z.string(),
  a: z.string(),
  b: z.string(),
  c: z.string(),
  isActionSuccess: z.literal(true),
});

// transform
const toSuccessSchema = (dto: z.infer<typeof _successSchema>) => {
  return zodSafeParse(successSchema, {
    ...dto,
    isActionSuccess: true as const,
  });
};

const failSchema = z.object({
  resCd: z.string().refine((val) => val !== '9999', '잘못된 resCd입니다'),
  resMsg: z.string(),
});

const toFailSchema = (dto: z.infer<typeof failSchema>) => {
  return zodSafeParse(failSchema, {
    ...dto,
    isActionSuccess: false as const,
  });
};

const schema = z.union([successSchema, failSchema]);

describe('테스트1', () => {
  it('이건 통과해야합니다', () => {
    const dto = {
      resCd: '5555',
      resMsg: 'ylfbi 통신했습니다',
    };

    const result = schema.safeParse(dto);
    if (result.success) {
      console.log(result);
    } else {
      console.log(result);
    }
  });
});
