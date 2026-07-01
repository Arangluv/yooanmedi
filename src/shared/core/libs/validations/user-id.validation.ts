import { z } from 'zod';

export const userIdValidation = z
  .string('아이디를 입력해주세요')
  .min(4, '아이디는 4글자 이상입니다');
