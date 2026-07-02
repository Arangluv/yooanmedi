'use client';

import Link from 'next/link';
import { BrandLogo } from '@/shared';
import { FieldGroupWrapper, FieldSeparator, FieldSetWrapper, Input } from '@/shared/ui/inputs';
import { useForm } from '@/shared/hooks';
import { zodResolver } from '@hookform/resolvers/zod';
import { JoinForm as JoinFormType } from './types';
import { joinFormValidation } from './form-validation';

const JoinPage = () => {
  const { control, register, onSubmit, errors } = useForm<JoinFormType>({
    resolver: zodResolver(joinFormValidation),
    onSubmit: async (values) => {},
  });

  return (
    <section className="flex w-full items-center justify-center bg-neutral-50 py-12">
      <div className="flex w-full max-w-2xl flex-col">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4">
          <Link href="/" prefetch={false} className="flex w-full justify-center">
            <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
          </Link>
          <h1 className="text-foreground-900 text-3xl font-bold">회원가입</h1>
        </div>
        {/* Form */}
        <form className="flex w-full flex-col rounded-2xl bg-white px-8 py-12" onSubmit={onSubmit}>
          <FieldGroupWrapper>
            {/* 로그인 정보 FieldSet */}
            <FieldSetWrapper
              title="로그인 정보"
              description="고객님의 비밀번호는 안전하게 암호화처리 하여 저장됩니다"
            >
              <Input {...register('id')} isRequired={true} label="아이디" error={errors.id} />
              <Input
                type={'password'}
                {...register('password')}
                isRequired={true}
                label="비밀번호"
                error={errors.password}
              />
              <Input
                type={'password'}
                {...register('passwordConfirm')}
                isRequired={true}
                label="비밀번호 확인"
                error={errors.passwordConfirm}
              />
            </FieldSetWrapper>
            {/* Separator */}
            <FieldSeparator />
            {/* 유저 정보 FieldSet */}
            <FieldSetWrapper title="회원 정보" description="상품구매, 주문관리 등을 위한 회원정보">
              <FieldGroupWrapper className="flex-row">
                <Input label="상호명" placeholder="ex. 00병원, 00약국" isRequired={true} />
                <Input label="대표자명" isRequired={true} type={'password'} />
              </FieldGroupWrapper>
              <FieldGroupWrapper className="flex-row">
                <Input
                  label="사업자등록번호"
                  description="10자리 숫자로 입력해주세요"
                  isRequired={true}
                  type={'number'}
                />
                <Input
                  label="요양기관번호"
                  description="8자리 숫자로 입력해주세요"
                  isRequired={true}
                  type={'number'}
                />
              </FieldGroupWrapper>
              <Input
                label="의사면허번호"
                description="병원인 경우 작성해주세요"
                type={'password'}
              />
              <Input label="전화번호" isRequired={true} type={'password'} disabled={true} />
              <FieldGroupWrapper className="flex-row">
                <Input label="실무자 연락처" type={'number'} />
                <Input label="FAX번호" type={'number'} />
              </FieldGroupWrapper>
            </FieldSetWrapper>
            {/* Separator */}
            {/* <FieldSeparator />
            <FieldSetWrapper title="배송지" description="구매하신 상품을 전달받으실 주소">
              <FieldWrapper label="주소" isRequired={true}>
                <Input />
              </FieldWrapper>
              <FieldWrapper label="상세주소" isRequired={true}>
                <Input type={'password'} />
              </FieldWrapper>
            </FieldSetWrapper> */}
            {/* Separator */}
            {/* <FieldSeparator />
            <FieldSetWrapper
              title="약관동의"
              description="유안메디팜 홈페이지의 이용약관 및 개인정보처리방침"
            >
              <FieldWrapper label="주소" isRequired={true}>
                <Input />
              </FieldWrapper>
              <FieldWrapper label="상세주소" isRequired={true}>
                <Input type={'password'} />
              </FieldWrapper>
            </FieldSetWrapper> */}
          </FieldGroupWrapper>
        </form>
      </div>
    </section>
  );
};

export default JoinPage;
