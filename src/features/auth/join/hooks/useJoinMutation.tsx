import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { BaseError } from '@/shared';
import { CreateFileResponse } from '@/entities/file';
import { checkDuplicateJoinFieldApi, clientJoinApi, ClientJoinApiResponse } from '../api';
import { JoinForm, JoinUniqueCheckFieldDto } from '../types';
import { JoinMapper } from '../mapper';

export const useJoinMutation = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: async (formData: JoinForm) => {
      // check duplicated field
      const checkFields: JoinUniqueCheckFieldDto[] = [
        { field: 'username', value: formData.id, message: '이미 사용중인 아이디입니다' },
        {
          field: 'nursingNumber',
          value: formData.nursingNumber,
          message: '이미 사용중인 요양기관번호입니다',
        },
        {
          field: 'businessNumber',
          value: formData.businessNumber,
          message: '이미 사용중인 사업자등록번호 입니다',
        },
      ];

      const checkFieldResponse = await checkDuplicateJoinFieldApi(checkFields);

      if (!checkFieldResponse.isSuccess) {
        throw new BaseError({
          clientMsg: '회원가입을 처리하는데 문제가 발생했습니다',
          errorName: 'ClientJoinError',
        });
      }

      if (checkFieldResponse.data.length !== 0) {
        throw new BaseError({
          clientMsg: '회원가입을 처리하는데 문제가 발생했습니다',
          errorName: 'JoinError',
          data: checkFieldResponse.data,
        });
      }

      // upload file
      const fileFormData = new FormData();
      fileFormData.append('file', formData.file);

      const fileUploadResponse = await fetch('api/file/create', {
        method: 'POST',
        body: fileFormData,
      });
      const fileUploadResult: CreateFileResponse = await fileUploadResponse.json();
      if (!fileUploadResult.isSuccess) {
        throw new BaseError({
          clientMsg: '증빙서류를 업로드하는데 문제가 발생했습니다',
          errorName: 'JoinUploadFileError',
        });
      }

      // create user
      return await clientJoinApi(
        JoinMapper.formToRequestDto({
          form: formData,
          file: fileUploadResult.data,
        }),
      );
    },

    onSuccess: (result: ClientJoinApiResponse) => {
      if (!result.isSuccess) {
        throw new BaseError({
          clientMsg: '회원가입을 진행하는데 문제가 발생했습니다',
          errorName: 'ClientJoinError',
        });
      }

      router.push('/');
    },

    onError: (error) => {
      throw error;
    },
  });
};
