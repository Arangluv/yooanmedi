'use client';

import { toast } from 'sonner';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from '@/shared';
import {
  FieldGroupWrapper,
  FieldSetWrapper,
  FieldSeparator,
  Input,
  AddressInput,
  Button,
} from '@/shared/ui/inputs';
import { useAuthStore } from '@/entities/user';
import { ModifyInfoForm } from '../types';
import { modifyUserInfoFormValidation } from '../validations';
import { useModifyInfoMutation } from '../hooks';
import { ModifyInfoMapper } from '../mapper';

export const ModifyUserInfoForm = () => {
  const user = useAuthStore((state) => state.user);
  const { mutateAsync: modifyMutateAsync, isPending } = useModifyInfoMutation();
  const { control, register, onSubmit, getFieldError, reset } = useForm<ModifyInfoForm>({
    resolver: zodResolver(modifyUserInfoFormValidation),
    defaultValues: {
      id: user.username,
      ceo: user.ceo,
      hospitalName: user.hospitalName,
      businessNumber: user.businessNumber,
      nursingNumber: user.nursingNumber,
      doctorLicenseNumber: user.doctorLicenseNumber,
      phoneNumber: user.phoneNumber,
      faxNumber: user.faxNumber,
      managerNumber: user.managerNumber,
      email: user.contactEmail ?? '',
      address: user.address.split('|')[0],
      addressDetail: user.address.split('|')[1],
      point: user.point,
    },
    onSubmit: async (values) => {
      const modifyInfoPromise = modifyMutateAsync(
        ModifyInfoMapper.formToRequestDto(values, user.id),
      );

      toast.promise(modifyInfoPromise, {
        loading: '회원정보를 수정중입니다..',
        success: (data) => data.message,
        error: '회원정보를 수정하는데 문제가 발생했습니다',
      });
    },
  });

  return (
    <form onSubmit={onSubmit}>
      <FieldGroupWrapper className="gap-12">
        <FieldSetWrapper label={{ content: '로그인 정보' }}>
          <FieldGroupWrapper className="flex-row">
            <Input label={{ content: '아이디' }} disabled readOnly {...register('id')} />
            <div className="w-full" />
          </FieldGroupWrapper>
        </FieldSetWrapper>
        <FieldSeparator />
        <FieldSetWrapper label={{ content: '회원 정보' }}>
          <FieldGroupWrapper className="flex-row">
            <Input label={{ content: '대표자명' }} disabled readOnly {...register('ceo')} />
            <Input label={{ content: '상호명' }} disabled readOnly {...register('hospitalName')} />
          </FieldGroupWrapper>
          <FieldGroupWrapper className="flex-row">
            <Input
              label={{ content: '이메일' }}
              disabled={isPending}
              {...register('email')}
              fieldError={{ errors: [getFieldError('email')] }}
            />
            <Input label={{ content: '보유적립금' }} disabled readOnly {...register('point')} />
          </FieldGroupWrapper>
          <FieldGroupWrapper className="flex-row">
            <Input
              label={{ content: '사업자등록번호' }}
              disabled
              readOnly
              {...register('businessNumber')}
            />
            <Input
              label={{ content: '요양기관번호' }}
              disabled
              readOnly
              {...register('nursingNumber')}
            />
            <Input
              label={{ content: '의사면허번호' }}
              disabled
              readOnly
              {...register('doctorLicenseNumber')}
            />
          </FieldGroupWrapper>
        </FieldSetWrapper>
        <FieldSeparator />
        <FieldSetWrapper label={{ content: '연락처' }}>
          <FieldGroupWrapper className="flex-row">
            <Input
              label={{ content: '휴대폰 번호' }}
              disabled
              readOnly
              {...register('phoneNumber')}
            />
            <Input
              label={{ content: '실무자 연락처' }}
              type="number"
              disabled={isPending}
              {...register('managerNumber')}
              fieldError={{ errors: [getFieldError('managerNumber')] }}
            />
            <Input
              label={{ content: 'FAX 번호' }}
              type="number"
              disabled={isPending}
              {...register('faxNumber')}
              fieldError={{ errors: [getFieldError('faxNumber')] }}
            />
          </FieldGroupWrapper>
        </FieldSetWrapper>
        <FieldSeparator />
        <FieldSetWrapper label={{ content: '배송지 정보' }}>
          <FieldGroupWrapper>
            <AddressInput
              label={{ content: '주소' }}
              description={{ content: '주소찾기를 통해 주소를 수정하실 수 있습니다' }}
              name={'address'}
              disabled={isPending}
              control={control}
              fieldError={{ errors: [getFieldError('address')] }}
            />
            <Input
              label={{ content: '상세주소' }}
              disabled={isPending}
              {...register('addressDetail')}
              fieldError={{ errors: [getFieldError('addressDetail')] }}
            />
          </FieldGroupWrapper>
        </FieldSetWrapper>
        <FieldSeparator />
        <FieldGroupWrapper className="flex-row justify-center gap-8">
          <Button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              reset();
            }}
            size="lg"
            className="bg-muted-foreground hover:bg-muted-foreground/80"
          >
            초기화하기
          </Button>
          <Button size="lg" type="submit">
            정보수정하기
          </Button>
        </FieldGroupWrapper>
      </FieldGroupWrapper>
    </form>
  );
};
