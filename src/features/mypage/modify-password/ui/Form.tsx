'use client';

import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { BaseError, useForm } from '@/shared';
import {
  FieldGroupWrapper,
  FieldSetWrapper,
  FieldSeparator,
  Input,
  Button,
} from '@/shared/ui/inputs';
import { useAuthStore } from '@/entities/user';
import { ModifyPasswordForm as ModifyPasswordFormType } from '../types';
import { modifyPasswordFormValidation } from '../validations';
import { useModifyPasswordMutation } from '../hooks';
import { ModifyPasswordMapper } from '../mapper';

export const ModifyPasswordForm = () => {
  const user = useAuthStore((state) => state.user);
  const { mutateAsync: modifyPasswordMutateAsync, isPending } = useModifyPasswordMutation();

  const { register, onSubmit, getFieldError } = useForm<ModifyPasswordFormType>({
    resolver: zodResolver(modifyPasswordFormValidation),
    onSubmit: async (values, { reset }) => {
      const dto = ModifyPasswordMapper.formToDto(values, user);
      const modifyPasswordPromise = modifyPasswordMutateAsync(dto);

      toast.promise(modifyPasswordPromise, {
        loading: '비밀번호를 변경중입니다..',
        success: () => {
          reset();
          return '비밀번호를 변경했습니다';
        },
        error: (error) => {
          if (error instanceof BaseError) {
            return error.getClientMessage();
          }

          return '비밀번호를 변경하는데 문제가 발생했습니다';
        },
      });
    },
  });

  return (
    <form onSubmit={onSubmit}>
      <FieldGroupWrapper>
        <FieldSetWrapper label={{ content: '비밀번호 재설정' }}>
          <FieldGroupWrapper className="w-1/2">
            <Input
              label={{ content: '현재 비밀번호' }}
              type={'password'}
              autoComplete="current-password"
              disabled={isPending}
              {...register('currentPassword')}
              fieldError={{ errors: [getFieldError('currentPassword')] }}
            />
            <FieldSeparator />
            <Input
              label={{ content: '변경하실 비밀번호' }}
              type={'password'}
              autoComplete="new-password"
              disabled={isPending}
              {...register('password')}
              fieldError={{ errors: [getFieldError('password')] }}
            />
            <Input
              label={{ content: '비밀번호 확인' }}
              type={'password'}
              autoComplete="new-password"
              disabled={isPending}
              {...register('passwordConfirm')}
              fieldError={{ errors: [getFieldError('passwordConfirm')] }}
            />
          </FieldGroupWrapper>
        </FieldSetWrapper>
        <FieldGroupWrapper className="w-1/3">
          <Button type="submit" size="lg">
            비밀번호 재설정하기
          </Button>
        </FieldGroupWrapper>
      </FieldGroupWrapper>
    </form>
  );
};
