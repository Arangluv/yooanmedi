import { useMutation } from '@tanstack/react-query';
import { modifyPasswordApi, ModifyPasswordApiResponse } from '../api';
import { BaseError } from '@/shared';

export const useModifyPasswordMutation = () => {
  return useMutation({
    mutationFn: modifyPasswordApi,
    onSuccess: (response: ModifyPasswordApiResponse) => {
      if (!response.isSuccess) {
        throw new BaseError({
          clientMsg: response.message,
          errorName: 'ModifyPasswordError',
        });
      }

      return { message: response.message };
    },
  });
};
