import { z } from 'zod';

export const modifyPasswordDtoSchema = z.object({
  currentPassword: z.string().refine((val) => val !== '', '현재 비밀번호가 누락되었습니다'),
  password: z.string().refine((val) => val !== '', '재설정할 비밀번호가 누락되었습니다'),
  user: z.number('유저 아이디가 누락되었습니다'),
});
