'use client'

import { Button, Divider, Form, Input, Link } from '@heroui/react'
import { CheckboxGroup, Checkbox } from '@heroui/checkbox'
import { ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'

const inputProps = {
  radius: 'sm',
  variant: 'bordered',
  labelPlacement: 'outside',
  isRequired: true,
  classNames: {
    inputWrapper: 'border-1',
    label: 'font-medium',
  },
} as const

export default function JoinForm() {
  return (
    <Form className="w-full flex flex-col gap-12">
      <JoinTermsContent />
      <LoginInfoContent />
      <PersonalInfoContent />
      <button className="w-full h-12 bg-brand text-white rounded-md font-medium cursor-pointer hover:bg-brandWeek transition-all duration-300">
        회원가입
      </button>
    </Form>
  )
}

function JoinTermsContent() {
  const [isTermsAgreed, setIsTermsAgreed] = useState(false)
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false)
  const [isAllAgreed, setIsAllAgreed] = useState(false)

  useEffect(() => {
    if (isTermsAgreed && isPrivacyAgreed) {
      setIsAllAgreed(true)
    } else {
      setIsAllAgreed(false)
    }
  }, [isTermsAgreed, isPrivacyAgreed])

  return (
    <div className="flex flex-col gap-6 w-full">
      <span className="text-foreground-800 font-bold text-lg">약관동의(유안메디팜 홈페이지)</span>
      <div className="flex flex-col gap-4 p-6 border-1 border-foreground-100 rounded-md w-full">
        <Checkbox
          isSelected={isAllAgreed}
          value="all"
          className="font-bold"
          radius="sm"
          onValueChange={(isSelected) => {
            setIsAllAgreed(isSelected)
            setIsTermsAgreed(isSelected)
            setIsPrivacyAgreed(isSelected)
          }}
        >
          전체 약관 동의
        </Checkbox>
        <Divider className="my-2 text-foreground-100" />
        <div className="flex w-full justify-between items-center">
          <Checkbox
            value="privacy"
            radius="sm"
            className="flex-shrink-0"
            isSelected={isTermsAgreed}
            onValueChange={(isSelected) => setIsTermsAgreed(isSelected)}
          >
            <div className="w-full">
              <span className="text-brand mr-1 text-[15px]">[필수]</span>이용약관
            </div>
          </Checkbox>
          <Link
            href="/terms?type=terms"
            target="_blank"
            className="w-full flex justify-end items-center"
          >
            <span className="text-sm text-foreground-500">자세히보기</span>
            <ChevronRight className="w-4 h-4 text-foreground-500" />
          </Link>
        </div>
        <div className="flex w-full justify-between items-center">
          <Checkbox
            value="privacy"
            radius="sm"
            className="flex-shrink-0"
            isSelected={isPrivacyAgreed}
            onValueChange={(isSelected) => setIsPrivacyAgreed(isSelected)}
          >
            <div className="w-full">
              <span className="text-brand mr-1 text-[15px]">[필수]</span>개인정보처리방침
            </div>
          </Checkbox>
          <Link
            href="/terms?type=privacy"
            target="_blank"
            className="w-full flex justify-end items-center"
          >
            <span className="text-sm text-foreground-500">자세히보기</span>
            <ChevronRight className="w-4 h-4 text-foreground-500" />
          </Link>
        </div>
      </div>
      <span className="text-sm text-foreground-500">
        *필수항목에 동의하지 않으실 경우 서비스 가입이 불가합니다
      </span>
    </div>
  )
}

function LoginInfoContent() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <span className="text-foreground-800 font-bold text-lg">로그인 정보</span>
      <Input name="id" label="아이디" placeholder="아이디를 입력해주세요." {...inputProps} />
      <Input
        name="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요."
        type="password"
        {...inputProps}
      />
      <Input
        name="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요."
        {...inputProps}
      />
    </div>
  )
}

function PersonalInfoContent() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <span className="text-foreground-800 font-bold text-lg">개인정보</span>
      <Input name="ceo" label="대표자명" placeholder="대표자명을 입력해주세요." {...inputProps} />
      <Input
        name="hospitalName"
        label="병원명"
        placeholder="병원명을 입력해주세요."
        {...inputProps}
      />
      <Input name="email" label="이메일" placeholder="이메일을 입력해주세요." {...inputProps} />
      <AddressInput />
      <Input
        name="businessNumber"
        label="사업자등록번호"
        placeholder="사업자등록번호를 입력해주세요."
        {...inputProps}
      />
      <Input
        name="nursingNumber"
        label="요양기관번호"
        placeholder="요양기관번호를 입력해주세요."
        {...inputProps}
      />
      <Input
        name="phoneNumber"
        label="전화번호"
        placeholder="전화번호를 입력해주세요."
        {...inputProps}
      />
      <Input
        name="faxNumber"
        label="FAX번호"
        placeholder="FAX번호를 입력해주세요."
        {...inputProps}
      />
    </div>
  )
}

function AddressInput() {
  return (
    <>
      <div className="flex gap-2 items-end">
        <Input
          name="address"
          label="주소"
          placeholder="주소를 입력해주세요."
          isDisabled
          {...inputProps}
        />
        <Button
          className="h-10 bg-brand text-white"
          radius="sm"
          onPress={() => {
            console.log('click')
          }}
        >
          주소검색
        </Button>
      </div>
      <Input
        name="address-detail"
        label="상세주소"
        isDisabled
        placeholder="상세주소를 입력해주세요."
        {...inputProps}
      />
    </>
  )
}
