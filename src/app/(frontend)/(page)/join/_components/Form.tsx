'use client'

import {
  Button,
  Divider,
  Form,
  Input,
  Link,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { Checkbox } from '@heroui/checkbox'
import { ChevronRight, Info } from 'lucide-react'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import Script from 'next/script'

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
  // Modal 관련 상태
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [modalContent, setModalContent] = useState<{
    header: React.ReactNode
    content: React.ReactNode
  }>({
    header: <ModalErrorHeader />,
    content: <ModdalErrorContent message="알림 내용" />,
  })
  //   error 관리
  const [errors, setErrors] = useState<{
    password: string
    passwordConfirm: string
    address: string
    addressDetail: string
  }>({
    password: '',
    passwordConfirm: '',
    address: '',
    addressDetail: '',
  })

  // 주소
  const [fullAddress, setFullAddress] = useState('')

  // 약관동의
  const [isTermsAgreed, setIsTermsAgreed] = useState(false)
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false)

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData.entries())

    if (!isTermsAgreed || !isPrivacyAgreed) {
      setModalContent({
        header: <ModalErrorHeader />,
        content: <ModdalErrorContent message="약관동의를 해주세요." />,
      })
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
      onOpen()
      return
    }

    if (data.password !== data.passwordConfirm) {
      setModalContent({
        header: <ModalErrorHeader />,
        content: <ModdalErrorContent message="비밀번호가가 일치하지 않습니다." />,
      })
      setErrors({
        ...errors,
        password: '비밀번호가 일치하지 않습니다.',
        passwordConfirm: '비밀번호가 일치하지 않습니다.',
      })
      onOpen()
      return
    }

    if (!fullAddress) {
      setModalContent({
        header: <ModalErrorHeader />,
        content: <ModdalErrorContent message="주소를 입력해주세요." />,
      })
      setErrors({
        ...errors,
        address: '주소를 입력해주세요.',
      })
      onOpen()
      return
    }

    if (!data.addressDetail) {
      setModalContent({
        header: <ModalErrorHeader />,
        content: <ModdalErrorContent message="상세주소를 입력해주세요." />,
      })
      setErrors({
        ...errors,
        addressDetail: '상세주소를 입력해주세요.',
      })
      onOpen()
      return
    }
  }

  return (
    <>
      <Form
        className="w-full flex flex-col gap-12"
        validationErrors={errors}
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        <JoinTermsContent
          isTermsAgreed={isTermsAgreed}
          setIsTermsAgreed={setIsTermsAgreed}
          isPrivacyAgreed={isPrivacyAgreed}
          setIsPrivacyAgreed={setIsPrivacyAgreed}
        />
        <LoginInfoContent errors={errors} setErrors={setErrors} />
        <PersonalInfoContent
          fullAddress={fullAddress}
          setFullAddress={setFullAddress}
          errors={errors}
          setErrors={setErrors}
        />
        <button className="w-full h-12 bg-brand text-white rounded-md font-medium cursor-pointer hover:bg-brandWeek transition-all duration-300">
          회원가입
        </button>
      </Form>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{modalContent.header}</ModalHeader>
          <ModalBody>{modalContent.content}</ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function JoinTermsContent({
  isTermsAgreed,
  setIsTermsAgreed,
  isPrivacyAgreed,
  setIsPrivacyAgreed,
}: {
  isTermsAgreed: boolean
  setIsTermsAgreed: (value: boolean) => void
  isPrivacyAgreed: boolean
  setIsPrivacyAgreed: (value: boolean) => void
}) {
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

function LoginInfoContent({
  errors,
  setErrors,
}: {
  errors: { password: string; passwordConfirm: string; address: string; addressDetail: string }
  setErrors: Dispatch<
    SetStateAction<{
      password: string
      passwordConfirm: string
      address: string
      addressDetail: string
    }>
  >
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <span className="text-foreground-800 font-bold text-lg">로그인 정보</span>
      <Input
        name="id"
        label="아이디"
        placeholder="아이디를 입력해주세요."
        {...inputProps}
        validate={IdValidation}
        description="아이디는 4자 이상 입력해주세요."
      />
      <Input
        name="password"
        label="비밀번호"
        placeholder="비밀번호를 입력해주세요."
        type="password"
        {...inputProps}
        isInvalid={errors.password !== ''}
        errorMessage={errors.password}
        onValueChange={(value) => {
          setErrors({
            ...errors,
            password: '',
            passwordConfirm: '',
          })
        }}
        description="비밀번호는 5자 이상 25자 이하로 입력해주세요."
        validate={PasswordValidation}
      />
      <Input
        name="passwordConfirm"
        label="비밀번호 확인"
        type="password"
        placeholder="비밀번호를 다시 입력해주세요."
        onValueChange={(value) => {
          setErrors({
            ...errors,
            password: '',
            passwordConfirm: '',
          })
        }}
        {...inputProps}
      />
    </div>
  )
}

function PersonalInfoContent({
  fullAddress,
  setFullAddress,
  errors,
  setErrors,
}: {
  fullAddress: string
  setFullAddress: (value: string) => void
  errors: { password: string; passwordConfirm: string; address: string; addressDetail: string }
  setErrors: Dispatch<
    SetStateAction<{
      password: string
      passwordConfirm: string
      address: string
      addressDetail: string
    }>
  >
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <span className="text-foreground-800 font-bold text-lg">개인정보</span>
      <Input
        name="ceo"
        label="대표자명"
        placeholder="대표자명을 입력해주세요."
        {...inputProps}
        validate={(value: string) => {
          if (!value) {
            return '대표자명을 입력해주세요.'
          }
          return true
        }}
      />
      <Input
        name="hospitalName"
        label="병원명"
        placeholder="병원명을 입력해주세요."
        {...inputProps}
        validate={(value: string) => {
          if (!value) {
            return '병원명을 입력해주세요.'
          }
          return true
        }}
      />
      <Input
        name="email"
        type="email"
        label="이메일"
        placeholder="이메일을 입력해주세요."
        {...inputProps}
        description="입력하신 이메일 주소로 세금계산서를 발행해드립니다."
        validate={(value: string) => {
          if (!value) {
            return '이메일을 입력해주세요.'
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
          if (!emailRegex.test(value)) {
            return '이메일 형식이 올바르지 않습니다.'
          }
          return true
        }}
      />
      <AddressInput
        fullAddress={fullAddress}
        setFullAddress={setFullAddress}
        errors={errors}
        setErrors={setErrors}
      />
      <Input
        name="businessNumber"
        type="number"
        label="사업자등록번호"
        description="10자리 숫자로 입력해주세요. (예: 1234567890)"
        placeholder="사업자등록번호를 입력해주세요."
        {...inputProps}
        validate={(value: string) => {
          if (!value) {
            return '사업자등록번호를 입력해주세요.'
          }
          if (value.length !== 10 || isNaN(Number(value))) {
            return '사업자등록번호는 10자리 숫자로 입력해주세요.'
          }
          return true
        }}
      />
      <Input
        name="nursingNumber"
        label="요양기관번호"
        type="number"
        description="8자리 숫자로 입력해주세요. (예: 12345678)"
        placeholder="요양기관번호를 입력해주세요."
        {...inputProps}
        validate={(value: string) => {
          if (!value) {
            return '요양기관번호를 입력해주세요.'
          }
          if (value.length !== 8 || isNaN(Number(value))) {
            return '요양기관번호는 8자리 숫자로 입력해주세요.'
          }
          return true
        }}
      />
      <Input
        name="phoneNumber"
        label="전화번호"
        placeholder="전화번호를 입력해주세요."
        type="number"
        description="예: 01012345678"
        {...inputProps}
        validate={(value: string) => {
          if (!value) {
            return '전화번호를 입력해주세요.'
          }
          if (isNaN(Number(value))) {
            return '전화번호는 10자리 숫자로 입력해주세요.'
          }
          return true
        }}
      />
      <Input
        name="faxNumber"
        label="FAX번호"
        placeholder="FAX번호를 입력해주세요."
        type="number"
        description="예: 0212345678"
        {...inputProps}
        validate={(value: string) => {
          if (!value) {
            return 'FAX번호를 입력해주세요.'
          }
          return true
        }}
      />
    </div>
  )
}

function AddressInput({
  fullAddress,
  setFullAddress,
  errors,
  setErrors,
}: {
  fullAddress: string
  setFullAddress: (value: string) => void
  errors: { password: string; passwordConfirm: string; address: string; addressDetail: string }
  setErrors: Dispatch<
    SetStateAction<{
      password: string
      passwordConfirm: string
      address: string
      addressDetail: string
    }>
  >
}) {
  const [isLayerVisible, setIsLayerVisible] = useState(false)
  const layerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // 다음 우편번호 API 스크립트가 로드된 후 실행
    if (typeof window !== 'undefined' && (window as any).daum) {
      initLayerPosition()
    }
  }, [isLayerVisible])

  const closeDaumPostcode = () => {
    setIsLayerVisible(false)
  }

  const sample2_execDaumPostcode = () => {
    if (typeof window === 'undefined' || !(window as any).daum) {
      console.error('다음 우편번호 API가 로드되지 않았습니다.')
      return
    }

    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        let addr = ''
        let extraAddr = ''

        if (data.userSelectedType === 'R') {
          addr = data.roadAddress
        } else {
          addr = data.jibunAddress
        }

        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')'
          }
        }

        setFullAddress(`${addr} ${extraAddr}, ${data.zonecode}`)
        setErrors({
          ...errors,
          address: '',
          addressDetail: '',
        })
        setIsLayerVisible(false)

        // 상세주소 입력 필드로 포커스 이동
        const detailInput = document.querySelector(
          'input[name="address-detail"]',
        ) as HTMLInputElement
        if (detailInput) {
          detailInput.focus()
        }
      },
      width: '100%',
      height: '100%',
      maxSuggestItems: 5,
    }).embed(layerRef.current)

    setIsLayerVisible(true)
    setTimeout(() => {
      initLayerPosition()
    }, 100)
  }

  const initLayerPosition = () => {
    if (!layerRef.current) return

    const width = 608
    const height = 400
    const borderWidth = 5

    layerRef.current.style.width = width + 'px'
    layerRef.current.style.height = height + 'px'
    layerRef.current.style.border = borderWidth + 'px solid'
  }

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
        onLoad={() => {
          // 스크립트 로드 완료 후 처리
        }}
      />
      <div className="flex gap-2 items-end relative">
        <Input
          name="address"
          value={fullAddress}
          label="주소"
          placeholder="주소를 입력해주세요."
          isDisabled
          {...inputProps}
          classNames={{
            ...inputProps.classNames,
            helperWrapper: '!hidden',
            errorMessage: 'hidden',
          }}
        />
        <Button className="h-10 bg-brand text-white" radius="sm" onPress={sample2_execDaumPostcode}>
          주소검색
        </Button>
        {/* 주소 모달창 */}
        <div
          id="layer"
          ref={layerRef}
          style={{
            display: isLayerVisible ? 'block' : 'none',
            position: 'absolute',
            overflow: 'hidden',
            top: '100%',
            left: 0,
            zIndex: 1000,
            WebkitOverflowScrolling: 'touch',
          }}
        >
          <img
            src="//t1.daumcdn.net/postcode/resource/images/close.png"
            id="btnCloseLayer"
            style={{
              cursor: 'pointer',
              position: 'absolute',
              right: '-3px',
              top: '-3px',
              zIndex: 1,
            }}
            onClick={closeDaumPostcode}
            alt="닫기 버튼"
          />
        </div>
      </div>
      <Input
        name="addressDetail"
        label="상세주소"
        isDisabled={fullAddress === ''}
        placeholder="상세주소를 입력해주세요."
        {...inputProps}
      />
    </>
  )
}

function IdValidation(value: string) {
  if (!value) {
    return '아이디를 입력해주세요.'
  }
  if (value.length < 4 || value.length > 20) {
    return '아이디는 4자 이상 20자 이하로 입력해주세요.'
  }
  const idRegex = /^[a-zA-Z0-9]+$/
  if (!idRegex.test(value)) {
    return '아이디는 영문과 숫자로 구성되어야 합니다.'
  }

  return true
}

function PasswordValidation(value: string) {
  if (!value) {
    return '비밀번호를 입력해주세요.'
  }
  if (value.length < 5 || value.length > 25) {
    return '비밀번호는 5자 이상 25자 이하로 입력해주세요.'
  }
  return true
}

function ModalErrorHeader() {
  return (
    <div className="flex items-center gap-2">
      <Info className="w-5 h-5 text-danger" />
      <span className="text-base font-bold text-foreground-600">알림</span>
    </div>
  )
}

function ModdalErrorContent({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[15px] text-foreground-600 whitespace-pre-wrap">{message}</p>
    </div>
  )
}
