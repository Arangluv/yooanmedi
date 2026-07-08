import { z } from 'zod';
import { requiredPasswordValidation } from '@/shared/core';

export const modifyPasswordFormValidation = z
  .object({
    currentPassword: requiredPasswordValidation,
    password: requiredPasswordValidation,
    passwordConfirm: requiredPasswordValidation,
  })
  .refine((data) => data.password === data.passwordConfirm, {
    error: '재설정한 비밀번호가 일치하지 않습니다',
    path: ['password'],
  });
