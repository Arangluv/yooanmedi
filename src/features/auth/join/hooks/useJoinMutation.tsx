import { useMutation } from '@tanstack/react-query';
import { FieldValue, FieldValues } from 'react-hook-form';
import { JoinForm } from '../types';

export const useJoinMutation = () => {
  return useMutation({
    mutationFn: async (formData: JoinForm) => {
      // call upload file API Router
      const fileId = await fetch("/file/create")
      // mapping to Dto (use mapper)
      // call server action
      // someFn()..
    },
    onSuccess: () => {},
  });
};
