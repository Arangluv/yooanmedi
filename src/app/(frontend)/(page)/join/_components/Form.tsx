'use client';

import {
  Button,
  Form,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { Checkbox } from '@heroui/checkbox';
import { ChevronRight, Info, Upload, FileText, Image as ImageIcon, Trash } from 'lucide-react';
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import clsx from 'clsx';
import { useMutation } from '@tanstack/react-query';
import { join } from '../actions';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneVerificationButton } from '@/features/phone-verification';
import { USAGE_CODE } from '@/features/phone-verification/constants/usage-code';

const inputProps = {
  radius: 'sm',
  variant: 'bordered',
  labelPlacement: 'outside',
  isRequired: true,
  classNames: {
    inputWrapper: 'border-1',
    label: 'font-medium',
  },
} as const;

export default function JoinForm() {
  // Modal 관련 상태
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [modalContent, setModalContent] = useState<{
    header: React.ReactNode;
    content: React.ReactNode;
  }>({
    header: <ModalErrorHeader />,
    content: <ModdalErrorContent message="알림 내용" />,
  });
  //   error 관리
  const [errors, setErrors] = useState<{
    password: string;
    passwordConfirm: string;
    address: string;
    addressDetail: string;
  }>({
    password: '',
    passwordConfirm: '',
    address: '',
    addressDetail: '',
  });

  // 주소
  const [fullAddress, setFullAddress] = useState('');
  // 약관동의
  const [isTermsAgreed, setIsTermsAgreed] = useState(false);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(false);
  // 증빙서류파일
  const [fileList, setFileList] = useState<File[]>([]);
  // loading state
  const [isLoading, setIsLoading] = useState(false);

  const { mutate: joinMutation } = useMutation({
    mutationFn: (formData: FormData) => join(formData),
    onSuccess: (data: { success: boolean; message: string }) => {
      setIsLoading(false);
      if (!data.success) {
        setModalContent({
          header: <ModalErrorHeader />,
          content: <ModdalErrorContent message={data.message} />,
        });
        onOpen();
        return;
      }
      toast.success('회원가입 신청이 정상적으로 완료되었습니다.');
      router.push('/');
    },
    onError: () => {
      setIsLoading(false);
      setModalContent({
        header: <ModalErrorHeader />,
        content: (
          <ModdalErrorContent
            message={'회원가입 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'}
          />
        ),
      });
      onOpen();
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setIsLoading(true);
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    // 실제 파일 데이터를 FormData에 파일별로 추가
    fileList.forEach((file, idx) => {
      formData.append('fileList', file);
    });
    formData.append('fullAddress', fullAddress);

    if (!isTermsAgreed || !isPrivacyAgreed) {
      setModalContent({
        header: <ModalErrorHeader />,
        content: <ModdalErrorContent message="약관동의를 진행해주세요." />,
      });
      onOpen();
      setIsLoading(false);
      return;
    }
    if (!formData.get('password') || formData.get('password') === '') {
      alert('비밀번호를 입력해주세요.');
      setErrors({
        ...errors,
        password: '비밀번호를 입력해주세요.',
      });
      setIsLoading(false);
      return;
    }

    // @ts-ignore
    if (formData.get('password').length < 5 || formData.get('password').length > 25) {
      setErrors({
        ...errors,
        password: '비밀번호는 5자 이상 25자 이하로 입력해주세요.',
      });
      setIsLoading(false);
      return;
    }

    if (formData.get('password') !== formData.get('passwordConfirm')) {
      setModalContent({
        header: <ModalErrorHeader />,
        content: <ModdalErrorContent message="비밀번호가 일치하지 않습니다." />,
      });
      setErrors({
        ...errors,
        password: '비밀번호가 일치하지 않습니다.',
        passwordConfirm: '비밀번호가 일치하지 않습니다.',
      });
      onOpen();
      setIsLoading(false);
      return;
    }

    if (!formData.get('fullAddress')) {
      setModalContent({
        header: <ModalErrorHeader />,
        content: <ModdalErrorContent message="주소를 입력해주세요." />,
      });
      setErrors({
        ...errors,
        address: '주소를 입력해주세요.',
      });
      onOpen();
      setIsLoading(false);
      return;
    }

    if (!formData.get('addressDetail')) {
      setModalContent({
        header: <ModalErrorHeader />,
        content: <ModdalErrorContent message="상세주소를 입력해주세요." />,
      });
      setErrors({
        ...errors,
        addressDetail: '상세주소를 입력해주세요.',
      });
      onOpen();
      setIsLoading(false);
      return;
    }

    if (formData.getAll('fileList').length === 0) {
      setModalContent({
        header: <ModalErrorHeader />,
        content: <ModdalErrorContent message="증빙서류를 업로드해주세요." />,
      });

      const fileUploadSection = document.querySelector(
        'label[for="fileUpload"]',
      ) as HTMLLabelElement | null;

      if (fileUploadSection) {
        fileUploadSection.scrollIntoView({ behavior: 'smooth' });
      }
      onOpen();
      setIsLoading(false);
      return;
    }

    joinMutation(formData);
  };

  const router = useRouter();

  return (
    <>
      <Form
        className="flex w-full flex-col gap-12"
        validationErrors={errors}
        validationBehavior="native"
        onSubmit={onSubmit}
      >
        <LoginInfoContent errors={errors} setErrors={setErrors} />
        <PersonalInfoContent
          fullAddress={fullAddress}
          setFullAddress={setFullAddress}
          errors={errors}
          setErrors={setErrors}
          fileList={fileList}
          setFileList={setFileList}
        />
        <JoinTermsContent
          isTermsAgreed={isTermsAgreed}
          setIsTermsAgreed={setIsTermsAgreed}
          isPrivacyAgreed={isPrivacyAgreed}
          setIsPrivacyAgreed={setIsPrivacyAgreed}
        />
        <Button
          type="submit"
          isLoading={isLoading}
          className="bg-brand hover:bg-brandWeek h-12 w-full cursor-pointer rounded-md text-base font-medium text-white transition-all duration-300"
        >
          회원가입
        </Button>
      </Form>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>{modalContent.header}</ModalHeader>
          <ModalBody>{modalContent.content}</ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function JoinTermsContent({
  isTermsAgreed,
  setIsTermsAgreed,
  isPrivacyAgreed,
  setIsPrivacyAgreed,
}: {
  isTermsAgreed: boolean;
  setIsTermsAgreed: (value: boolean) => void;
  isPrivacyAgreed: boolean;
  setIsPrivacyAgreed: (value: boolean) => void;
}) {
  return (
    <>
      <div className="flex w-full flex-col gap-6">
        <span className="text-foreground-800 text-lg font-bold">약관동의(유안메디팜 홈페이지)</span>
        <div className="border-foreground-100 flex w-full flex-col gap-4 rounded-md border-1 p-6">
          <div className="flex w-full items-center justify-between">
            <Checkbox
              value="privacy"
              radius="sm"
              className="flex-shrink-0"
              isSelected={isTermsAgreed}
              onValueChange={() => {
                setIsTermsAgreed(!isTermsAgreed);
              }}
            >
              <div className="w-full">
                <span className="text-brand mr-1 text-[15px]">[필수]</span>이용약관
              </div>
            </Checkbox>
            <Link
              href="/terms?type=terms"
              prefetch={false}
              target="_blank"
              className="flex w-fit cursor-pointer items-center justify-end"
            >
              <span className="text-foreground-500 text-sm">확인하기</span>
              <ChevronRight className="text-foreground-500 h-4 w-4" />
            </Link>
          </div>
          <div className="flex w-full items-center justify-between">
            <Checkbox
              value="privacy"
              radius="sm"
              className="flex-shrink-0"
              isSelected={isPrivacyAgreed}
              onValueChange={() => {
                setIsPrivacyAgreed(!isPrivacyAgreed);
              }}
            >
              <div className="w-full">
                <span className="text-brand mr-1 text-[15px]">[필수]</span>개인정보처리방침
              </div>
            </Checkbox>
            <Link
              href="/terms?type=privacy"
              prefetch={false}
              target="_blank"
              className="flex w-fit cursor-pointer items-center justify-end"
            >
              <span className="text-foreground-500 text-sm">확인하기</span>
              <ChevronRight className="text-foreground-500 h-4 w-4" />
            </Link>
          </div>
        </div>
        <span className="text-foreground-500 text-sm">
          *필수항목에 동의하지 않으실 경우 서비스 가입이 불가합니다
        </span>
      </div>
    </>
  );
}

function LoginInfoContent({
  errors,
  setErrors,
}: {
  errors: { password: string; passwordConfirm: string; address: string; addressDetail: string };
  setErrors: Dispatch<
    SetStateAction<{
      password: string;
      passwordConfirm: string;
      address: string;
      addressDetail: string;
    }>
  >;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <span className="text-foreground-800 text-lg font-bold">로그인 정보</span>
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
          });
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
          });
        }}
        {...inputProps}
      />
    </div>
  );
}

function PersonalInfoContent({
  fullAddress,
  setFullAddress,
  errors,
  setErrors,
  fileList,
  setFileList,
}: {
  fullAddress: string;
  setFullAddress: (value: string) => void;
  errors: { password: string; passwordConfirm: string; address: string; addressDetail: string };
  setErrors: Dispatch<
    SetStateAction<{
      password: string;
      passwordConfirm: string;
      address: string;
      addressDetail: string;
    }>
  >;
  fileList: File[];
  setFileList: (value: File[]) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-6">
      <span className="text-foreground-800 text-lg font-bold">개인정보</span>
      <Input
        name="ceo"
        label="대표자명"
        placeholder="대표자명을 입력해주세요."
        {...inputProps}
        validate={(value: string) => {
          if (!value) {
            return '대표자명을 입력해주세요.';
          }
          return true;
        }}
      />
      <Input
        name="hospitalName"
        label="병원명"
        placeholder="병원명을 입력해주세요."
        {...inputProps}
        validate={(value: string) => {
          if (!value) {
            return '병원명을 입력해주세요.';
          }
          return true;
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
            return '이메일을 입력해주세요.';
          }
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value)) {
            return '이메일 형식이 올바르지 않습니다.';
          }
          return true;
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
            return '사업자등록번호를 입력해주세요.';
          }
          if (value.length !== 10 || isNaN(Number(value))) {
            return '사업자등록번호는 10자리 숫자로 입력해주세요.';
          }
          return true;
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
            return '요양기관번호를 입력해주세요.';
          }
          if (value.length !== 8 || isNaN(Number(value))) {
            return '요양기관번호는 8자리 숫자로 입력해주세요.';
          }
          return true;
        }}
      />
      <Input
        name="doctorLicenseNumber"
        label="의사면허번호"
        type="number"
        placeholder="의사면허번호를 입력해주세요."
        {...inputProps}
        isRequired
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
            return '전화번호를 입력해주세요.';
          }
          if (isNaN(Number(value))) {
            return '전화번호는 10자리 숫자로 입력해주세요.';
          }
          return true;
        }}
      />
      {/* <PhoneVerificationButton usageCode="SIGNUP" /> */}
      <Input
        name="faxNumber"
        label="FAX번호(선택)"
        placeholder="FAX번호를 입력해주세요."
        type="number"
        description="예: 0212345678"
        {...inputProps}
        isRequired={false}
      />
      <FileUploadInput fileList={fileList} setFileList={setFileList} />
    </div>
  );
}

function AddressInput({
  fullAddress,
  setFullAddress,
  errors,
  setErrors,
}: {
  fullAddress: string;
  setFullAddress: (value: string) => void;
  errors: { password: string; passwordConfirm: string; address: string; addressDetail: string };
  setErrors: Dispatch<
    SetStateAction<{
      password: string;
      passwordConfirm: string;
      address: string;
      addressDetail: string;
    }>
  >;
}) {
  const [isLayerVisible, setIsLayerVisible] = useState(false);
  const layerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 다음 우편번호 API 스크립트가 로드된 후 실행
    if (typeof window !== 'undefined' && (window as any).daum) {
      initLayerPosition();
    }
  }, [isLayerVisible]);

  const closeDaumPostcode = () => {
    setIsLayerVisible(false);
  };

  const sample2_execDaumPostcode = () => {
    if (typeof window === 'undefined' || !(window as any).daum) {
      return;
    }

    new (window as any).daum.Postcode({
      oncomplete: function (data: any) {
        let addr = '';
        let extraAddr = '';

        if (data.userSelectedType === 'R') {
          addr = data.roadAddress;
        } else {
          addr = data.jibunAddress;
        }

        if (data.userSelectedType === 'R') {
          if (data.bname !== '' && /[동|로|가]$/g.test(data.bname)) {
            extraAddr += data.bname;
          }
          if (data.buildingName !== '' && data.apartment === 'Y') {
            extraAddr += extraAddr !== '' ? ', ' + data.buildingName : data.buildingName;
          }
          if (extraAddr !== '') {
            extraAddr = ' (' + extraAddr + ')';
          }
        }

        setFullAddress(`${addr} ${extraAddr}, ${data.zonecode}`);
        setErrors({
          ...errors,
          address: '',
          addressDetail: '',
        });
        setIsLayerVisible(false);

        // 상세주소 입력 필드로 포커스 이동
        const detailInput = document.querySelector(
          'input[name="address-detail"]',
        ) as HTMLInputElement;
        if (detailInput) {
          detailInput.focus();
        }
      },
      width: '100%',
      height: '100%',
      maxSuggestItems: 5,
    }).embed(layerRef.current);

    setIsLayerVisible(true);
    setTimeout(() => {
      initLayerPosition();
    }, 100);
  };

  const initLayerPosition = () => {
    if (!layerRef.current) return;

    const width = 608;
    const height = 400;
    const borderWidth = 5;

    layerRef.current.style.width = width + 'px';
    layerRef.current.style.height = height + 'px';
    layerRef.current.style.border = borderWidth + 'px solid';
  };

  return (
    <>
      <Script
        src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="lazyOnload"
        onLoad={() => {
          // 스크립트 로드 완료 후 처리
        }}
      />
      <div className="relative flex items-end gap-2">
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
        <Button className="bg-brand h-10 text-white" radius="sm" onPress={sample2_execDaumPostcode}>
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
          <Image
            src="https://t1.daumcdn.net/postcode/resource/images/close.png"
            id="btnCloseLayer"
            width={16}
            height={16}
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
  );
}

function FileUploadInput({
  fileList,
  setFileList,
}: {
  fileList: File[];
  setFileList: (value: File[]) => void;
}) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setFileList(Array.from(files));
    }
  };

  const FileListItems = ({ file }: { file: File }) => {
    const handleFileDelete = (file: File) => {
      // 파일 객체 전체가 아닌 name과 size 모두로 필터해야 동일 파일명 업로드 가능
      setFileList(fileList.filter((f) => !(f.name === file.name && f.size === file.size)));
      // input[type=file] value 초기화로 재업로드 가능하게 함
      const input = document.getElementById('fileUpload') as HTMLInputElement | null;
      if (input) {
        input.value = '';
      }
    };

    return (
      <div className="border-foreground-100 flex items-center justify-between gap-6 rounded-md border-1 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <FileText className="text-foreground-500 h-5 w-5" />
          </div>
          <div className="flex flex-col gap-[2px]">
            <span className="text-[13px] font-medium">{file.name}</span>
            <span className="text-foreground-500 text-[12px]">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Trash
            className="text-foreground-500 hover:text-danger h-4 w-4 cursor-pointer transition-all duration-300"
            onClick={() => handleFileDelete(file)}
          />
        </div>
      </div>
    );
  };
  return (
    <div className="flex flex-col gap-4">
      <span className="after:text-danger text-[14px] font-medium after:ml-[2px] after:content-['*']">
        사업자등록증 제출
      </span>
      <label
        htmlFor="fileUpload"
        className={clsx(
          'border-foreground-200 flex w-full flex-col items-center justify-center gap-2 rounded-md border-1 border-dashed py-6',
          'hover:bg-foreground-50 cursor-pointer transition-all duration-300',
        )}
      >
        <div className="bg-foreground-100 rounded-full p-3">
          <Upload className="text-foreground-400 h-5 w-5" />
        </div>
        <span className="text-[15px] font-medium">
          사업자등록증을 <span className="text-brand">업로드</span>해주세요
        </span>
        <span className="text-foreground-500 text-[13px]">
          파일 최대 크기: 25MB • 최대 파일 개수: 5
        </span>
      </label>
      <input type="file" id="fileUpload" className="hidden" multiple onChange={handleFileChange} />
      {/* 파일 리스트 */}
      {fileList.length > 0 ? (
        <div className="mt-2 flex flex-col gap-2">
          {fileList.map((file) => (
            <FileListItems key={file.name} file={file} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function IdValidation(value: string) {
  if (!value) {
    return '아이디를 입력해주세요.';
  }
  if (value.length < 4 || value.length > 20) {
    return '아이디는 4자 이상 20자 이하로 입력해주세요.';
  }
  const idRegex = /^[a-zA-Z0-9]+$/;
  if (!idRegex.test(value)) {
    return '아이디는 영문과 숫자로 구성되어야 합니다.';
  }

  return true;
}

function PasswordValidation(value: string) {
  if (!value) {
    return '비밀번호를 입력해주세요.';
  }
  if (value.length < 5 || value.length > 25) {
    return '비밀번호는 5자 이상 25자 이하로 입력해주세요.';
  }
  return true;
}

function ModalErrorHeader() {
  return (
    <div className="flex items-center gap-2">
      <Info className="text-danger h-5 w-5" />
      <span className="text-foreground-600 text-base font-bold">알림</span>
    </div>
  );
}

function ModdalErrorContent({ message }: { message: string }) {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-foreground-600 text-[15px] whitespace-pre-wrap">{message}</p>
    </div>
  );
}
