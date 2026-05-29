import { z } from 'zod';
import { userSchema } from './user.schema';

/** 수정 가능한 필드를 pick, parital로 조정할 수 있습니다 */
export const updateUserSchema = z.object({
  user: z.number(),
  data: userSchema
    .pick({
      point: true,
    })
    .partial(),
});
