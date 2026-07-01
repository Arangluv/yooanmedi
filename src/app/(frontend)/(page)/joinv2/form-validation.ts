import { z } from 'zod';
import { passwordValidation, userIdValidation } from '@/shared/core';

export const joinFormValidation = z
  .object({
    id: userIdValidation,
    password: passwordValidation,
    passwordConfirm: passwordValidation,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: '비밀번호가 일치하지 않습니다.',
    path: ['passwordConfirm'],
  });
