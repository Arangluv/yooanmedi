'use client';

import { useState } from 'react';
import { Button, Form, Input } from '@heroui/react';
import { Lock, User } from 'lucide-react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/app/(frontend)/actions';
import { BrandLogo } from '@/config/Logo';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function MainForm() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [content, setContent] = useState<React.ReactNode>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const { mutate: loginMutation } = useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => login(id, password),
    onSuccess: (data: { success: boolean; message: string }) => {
      setIsLoading(false);
      if (!data.success) {
        setContent(<ErrorContent error={data.message} />);
        onOpen();
        return;
      }

      router.push('/order');
    },
    onError: () => {
      setIsLoading(false);
      setContent(<ErrorContent error={'아이디 혹은 비밀번호가 올바르지 않습니다.'} />);
      onOpen();
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target as HTMLFormElement);
    const id = formData.get('id') as string;
    const password = formData.get('password') as string;
    loginMutation({ id, password });
  };

  return (
    <>
      <div className="flex h-full w-full flex-col">
        {/* 로고 */}
        <div className="mb-8 flex w-full justify-center">
          <div className="h-[60px] w-[210px]">
            <BrandLogo width={210} height={60} className="h-[60px] w-[210px]" />
          </div>
        </div>
        {/* 폼 */}
        <Form validationBehavior="native" className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Input
            name="id"
            label="아이디"
            size="md"
            placeholder="아이디를 입력해주세요."
            radius="sm"
            startContent={<User className="text-foreground-500 h-5 w-5" strokeWidth={1.5} />}
            classNames={{
              label: 'font-medium',
              errorMessage: 'text-[14px]',
            }}
            isRequired={true}
            validate={(value: string) => {
              if (!value) {
                return '아이디를 입력해주세요.';
              }
              const idRegex = /^[a-zA-Z0-9]+$/;
              if (!idRegex.test(value)) {
                return '아이디는 영문과 숫자로 구성되어야 합니다.';
              }
              return true;
            }}
          />
          <Input
            name="password"
            label="비밀번호"
            type="password"
            size="md"
            placeholder="비밀번호를 입력해주세요."
            validate={(value: string) => {
              if (!value) {
                return '비밀번호를 입력해주세요.';
              }

              return true;
            }}
            isRequired={true}
            radius="sm"
            startContent={<Lock className="text-foreground-500 h-5 w-5" strokeWidth={1.5} />}
            classNames={{
              label: 'font-medium',
              errorMessage: 'text-[14px]',
            }}
          />
          <div className="flex w-full justify-end">
            <Link
              href={'/find?type=id'}
              prefetch={false}
              className="text-foreground-500 hover:text-brandWeek cursor-pointer text-sm transition-all duration-300"
            >
              아이디 / 비밀번호 찾기
            </Link>
          </div>
          <div className="bg-foreground-100 h-[1px] w-full" />
          <div className="flex w-full flex-col gap-2">
            <Button
              type="submit"
              isLoading={isLoading}
              className="bg-brand hover:bg-brandWeek h-10 w-full cursor-pointer rounded-sm text-base font-medium text-white transition-all duration-300"
            >
              로그인
            </Button>
            <Link
              href="/join"
              prefetch={false}
              className="text-brandWeek flex h-10 w-full cursor-pointer items-center justify-center rounded-sm border-1 font-medium"
            >
              회원가입
            </Link>
          </div>
        </Form>
        {/* 하단 컨텐츠 */}
        <div className="mt-12 flex flex-col gap-8">
          <div className="flex gap-4">
            {/* service */}
            <div className="flex w-full flex-col">
              <span className="text-brandWeek font-bold">상담안내</span>
              <div className="mt-2 flex flex-col gap-1">
                <span className="text-foreground-600 text-[15px]">평일 09:00 - 17:00</span>
                <span className="text-foreground-600 text-[14px]">점심시간 12:00 - 13:00</span>
                <span className="text-foreground-600 text-[14px]">(주말 및 공휴일 휴무)</span>
              </div>
            </div>
            {/* 배송 휴무안내*/}
            <div className="flex w-full flex-col">
              <span className="text-brandWeek font-bold">택배 주문마감 안내</span>
              <div className="mt-2 flex flex-col gap-1">
                <span className="text-foreground-600 text-[14px]">평일 14:00 까지</span>
                <span className="text-foreground-600 text-[14px]">(주말 및 공휴일 휴무)</span>
              </div>
            </div>
          </div>
          <div className="flex w-full flex-col">
            <span className="mt-3 text-[16px] font-medium">TEL : 031-893-0806</span>
            <span className="mt-1 text-[16px] font-medium">FAX : 031-893-0809</span>
            <span className="mt-1 flex-shrink-0 text-[16px] font-medium">
              EMAIL : yooanmedi@gmail.com
            </span>
          </div>
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} radius="sm">
        <ModalContent>
          <ModalHeader>
            <span className="text-lg font-bold">알림</span>
          </ModalHeader>
          <ModalBody>{content}</ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

function ErrorContent({ error }: { error: string }) {
  return (
    <div className="flex flex-col">
      <p className="text-foreground-700 text-[15px]">
        <span className="text-danger">{error}</span>
      </p>
    </div>
  );
}
