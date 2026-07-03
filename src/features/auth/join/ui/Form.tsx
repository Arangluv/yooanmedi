'use client';

import Link from 'next/link';
import { zodResolver } from '@hookform/resolvers/zod';
import { PhoneVerificationInput } from '@/features/phone-verification';
import {
  FieldGroupWrapper,
  FieldSeparator,
  FieldSetWrapper,
  Input,
  AddressInput,
  CheckBox,
  FileUploadInput,
  Button,
} from '@/shared/ui/inputs';
import { useForm } from '@/shared';
import { JoinForm as JoinFormType } from '../types';
import { joinFormValidation } from '../validations';

export const JoinForm = () => {
  const { control, register, onSubmit, getFieldError, setValue } = useForm<JoinFormType>({
    resolver: zodResolver(joinFormValidation),
    onSubmit: async (values) => {
      console.log('values');
      console.log(values);
    },
  });

  // 휴대폰 번호는 임시
  setValue('phoneNumber', '01012345678');

  return (
    <form className="flex w-full flex-col rounded-2xl bg-white px-8 py-12" onSubmit={onSubmit}>
      <FieldGroupWrapper>
        {/* 로그인 정보 FieldSet */}
        <FieldSetWrapper
          label={{ content: '로그인 정보' }}
          description={{ content: '고객님의 비밀번호는 안전하게 암호화처리 하여 저장됩니다' }}
        >
          <Input
            label={{ content: '아이디' }}
            isRequired={true}
            {...register('id')}
            autoComplete="username"
            fieldError={{ errors: [getFieldError('id')] }}
          />
          <Input
            label={{ content: '비밀번호' }}
            isRequired={true}
            type={'password'}
            {...register('password')}
            autoComplete="new-password"
            fieldError={{ errors: [getFieldError('password')] }}
          />
          <Input
            label={{ content: '비밀번호 확인' }}
            type={'password'}
            isRequired={true}
            {...register('passwordConfirm')}
            autoComplete="new-password"
            fieldError={{ errors: [getFieldError('passwordConfirm')] }}
          />
        </FieldSetWrapper>
        {/* Separator */}
        <FieldSeparator />
        {/* 유저 정보 FieldSet */}
        <FieldSetWrapper
          label={{ content: '회원정보' }}
          description={{ content: '상품구매, 주문관리 등을 위한 회원정보' }}
        >
          <FieldGroupWrapper className="flex-row">
            <Input
              label={{ content: '상호명' }}
              placeholder="ex. 00병원, 00약국"
              isRequired={true}
              {...register('hospitalName')}
              fieldError={{ errors: [getFieldError('hospitalName')] }}
            />
            <Input
              label={{ content: '대표자명' }}
              isRequired={true}
              {...register('ceo')}
              fieldError={{ errors: [getFieldError('ceo')] }}
            />
          </FieldGroupWrapper>
          <FieldGroupWrapper className="flex-row">
            <Input
              label={{ content: '사업자등록번호' }}
              description={{ content: '-을 제외한 숫자를 입력해주세요' }}
              isRequired={true}
              type={'number'}
              {...register('businessNumber')}
              fieldError={{ errors: [getFieldError('businessNumber')] }}
            />
            <Input
              label={{ content: '요양기관번호' }}
              description={{ content: '8자리 숫자로 입력해주세요' }}
              isRequired={true}
              type={'number'}
              {...register('nursingNumber')}
              fieldError={{ errors: [getFieldError('nursingNumber')] }}
            />
          </FieldGroupWrapper>
          <Input
            label={{ content: '의사면허번호' }}
            description={{ content: '병원인 경우 작성해주세요' }}
            type={'number'}
            {...register('doctorLicenseNumber')}
            fieldError={{ errors: [getFieldError('doctorLicenseNumber')] }}
          />
          <PhoneVerificationInput
            label={{ content: '휴대폰번호' }}
            usageCode="01001"
            name="phoneNumber"
            control={control}
            fieldError={{ errors: [getFieldError('phoneNumber')] }}
          />
          <FieldGroupWrapper className="flex-row">
            <Input
              label={{ content: '실무자 연락처' }}
              type={'number'}
              {...register('managerNumber')}
              fieldError={{ errors: [getFieldError('managerNumber')] }}
            />
            <Input
              label={{ content: 'FAX번호' }}
              type={'number'}
              {...register('faxNumber')}
              fieldError={{ errors: [getFieldError('faxNumber')] }}
            />
          </FieldGroupWrapper>
          <FileUploadInput
            name="file"
            control={control}
            isRequired
            fieldLabel={{ content: '사업자등록증 업로드' }}
            description={{
              content: '회원가입 승인을 위해 확인하는 용도로 사용되며 데이터는 안전하게 보관됩니다',
            }}
            fieldError={{ errors: [getFieldError('file')] }}
          />
        </FieldSetWrapper>
        {/* Separator */}
        <FieldSeparator />
        <FieldSetWrapper
          label={{ content: '배송지' }}
          description={{ content: '구매하신 상품을 전달받으실 주소' }}
        >
          <AddressInput
            name="address"
            control={control}
            label={{ content: '주소' }}
            isRequired={true}
            fieldError={{ errors: [getFieldError('address')] }}
          />
          <Input
            label={{ content: '상세주소' }}
            isRequired={true}
            type={'text'}
            {...register('addressDetail')}
            fieldError={{ errors: [getFieldError('addressDetail')] }}
          />
        </FieldSetWrapper>
        {/* Separator */}
        <FieldSeparator />
        <FieldSetWrapper
          label={{ content: '약관동의' }}
          description={{ content: '유안메디팜 홈페이지의 이용약관 및 개인정보처리방침' }}
        >
          <FieldGroupWrapper className="rounded-md border-1 p-4">
            <CheckBox
              label={{ content: '이용약관 동의' }}
              description={{
                content: <Link href={'/terms?type=terms'}>이용약관 확인하기</Link>,
              }}
              name={'termsAgree'}
              control={control}
              isRequired={true}
              fieldError={{ errors: [getFieldError('termsAgree')] }}
            />
            <CheckBox
              label={{ content: '개인정보처리방침 동의' }}
              description={{
                content: <Link href={'/terms?type=privacy'}>개인정보처리방침 확인하기</Link>,
              }}
              name={'privacyPolicyAgree'}
              control={control}
              isRequired={true}
              fieldError={{ errors: [getFieldError('privacyPolicyAgree')] }}
            />
          </FieldGroupWrapper>
        </FieldSetWrapper>
        <Button type="submit" className="h-12">
          회원가입하기
        </Button>
      </FieldGroupWrapper>
    </form>
  );
};
