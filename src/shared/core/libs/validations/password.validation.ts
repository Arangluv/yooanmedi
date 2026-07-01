import { z } from 'zod';

export const passwordValidation = z
  .string('비밀번호를 입력해주세요')
  .min(5, '비빌번호는 5글자 이상이어야 합니다')
  .max(25, '비밀번호는 25글자 이하여야 합니다');
