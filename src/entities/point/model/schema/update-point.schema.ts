import { z } from 'zod';

export const userSchema = z.object({
  id: z.number(),
  point: z.number('보유포인트 필드는 비어있을 수 없습니다').min(0, '적립금은 0 이상이어야 합니다'),
});
export type User = z.infer<typeof userSchema>;
