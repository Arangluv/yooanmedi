import { z } from 'zod';
import { BaseSchema } from '@/shared';

export const userReferenceSchema = z.object({
  id: BaseSchema.collectionId({
    required_message: 'asd',
  }),
  point: BaseSchema.number({
    required_message: '보유보인트는 비어있을 수 없습니다',
    min: 0,
  }),
});
