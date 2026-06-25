import { z } from 'zod';
import { BaseSchema } from '@/shared';
import { PayloadTerms } from '@/shared';

export const termsSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: '이용약관 아이디가 누락되었습니다',
    invalid_message: '잘못된 이용약관 아이디 타입입니다',
  }),
  content: z.custom<PayloadTerms['content']>(),
});
