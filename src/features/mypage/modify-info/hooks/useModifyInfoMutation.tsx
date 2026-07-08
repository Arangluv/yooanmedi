import { useMutation } from '@tanstack/react-query';
import { modifyUserInfoApi, ModifyUserInfoApiResponse } from '../api';
import { BaseError } from '@/shared';

export const useModifyInfoMutation = () => {
  return useMutation({
    mutationFn: modifyUserInfoApi,
    onSuccess: (response: ModifyUserInfoApiResponse) => {
      if (!response.isSuccess) {
        throw new BaseError({
          clientMsg: response.message,
          errorName: 'ModifyUserInfoError',
        });
      }

      return { data: response.data, message: response.message };
    },
  });
};
