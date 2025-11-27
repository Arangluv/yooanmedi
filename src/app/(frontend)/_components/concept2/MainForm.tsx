'use client'

import { LogoContext } from '@/context/design_contexts'
import Image from 'next/image'
import { useContext, useState } from 'react'
import { Button, Form, Input } from '@heroui/react'
import { Globe, Lock, Mail } from 'lucide-react'
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { login } from '@/app/(frontend)/actions'

export default function MainForm() {
  const { logoImage } = useContext(LogoContext)
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [content, setContent] = useState<React.ReactNode>(null)
  const [isLoading, setIsLoading] = useState(false)

  const { mutate: loginMutation } = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onSuccess: () => {
      setIsLoading(false)
      // redirect to order page
      alert('로그인 성공 - 추후 주문페이지가 완성 시 이동합니다')
    },
    onError: () => {
      setIsLoading(false)
      setContent(<ErrorContent />)
      onOpen()
      // some action
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    loginMutation({ email, password })
  }

  return (
    <>
      <div className="w-full flex flex-col">
        {/* 로고 */}
        <div className="w-full flex justify-center mb-8">
          <div className="w-[210px] h-[60px]">
            <Image src={logoImage} alt="logo" className="w-full h-full object-cover" />
          </div>
        </div>
        <Form validationBehavior="native" className="flex flex-col gap-4" onSubmit={onSubmit}>
          <Input
            name="email"
            label="이메일"
            size="md"
            placeholder="이메일을 입력해주세요."
            isRequired={true}
            variant="bordered"
            radius="sm"
            startContent={<Mail className="text-foreground-500 w-5 h-5" strokeWidth={1.5} />}
            classNames={{
              label: 'font-medium',
              errorMessage: 'text-[14px]',
            }}
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
          <Input
            name="password"
            label="비밀번호"
            size="md"
            type="password"
            isRequired={true}
            placeholder="비밀번호를 입력해주세요."
            variant="bordered"
            radius="sm"
            startContent={<Lock className="text-foreground-500 w-5 h-5" strokeWidth={1.5} />}
            classNames={{
              label: 'font-medium',
              errorMessage: 'text-[14px]',
            }}
            validate={(value: string) => {
              if (!value) {
                return '비밀번호를 입력해주세요.'
              }

              return true
            }}
          />
          <div className="flex flex-col gap-2 w-full">
            <Button
              type="submit"
              isLoading={isLoading}
              className="text-base w-full h-10 rounded-sm bg-brand text-white font-medium cursor-pointer hover:bg-brandWeek transition-all duration-300"
            >
              로그인
            </Button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setContent(<JoinContent />)
                onOpen()
              }}
              className="w-full h-10 rounded-sm border-1 text-brandWeek font-medium cursor-pointer"
            >
              회원가입
            </button>
          </div>
          <div className="h-[1px] bg-foreground-100 w-full" />
          <div className="w-full flex justify-end">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                setContent(<PasswordFindContent />)
                onOpen()
              }}
              className="text-sm text-foreground-500 cursor-pointer hover:text-brandWeek transition-all duration-300"
            >
              비밀번호 찾기
            </button>
          </div>
        </Form>
        {/* 하단 컨텐츠 */}
        <div className="flex flex-col gap-8 mt-12">
          {/* service */}
          <div className="w-full flex gap-8 items-stretch justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-brand text-lg leading-none">상담안내</span>
              <div className="w-full flex justify-end text-[13px] text-foreground-500">service</div>
            </div>
            {/* <div className="w-[1px] h-auto bg-foreground-100"></div> */}
            <div className="flex flex-col gap-2 items-end">
              <span className="text-[15px] text-foreground-600 leading-none">
                평일 09:00 - 18:00
              </span>
              <span className="text-[15px] text-foreground-600 leading-none">
                점심시간 12:00 - 13:00
              </span>
              <span className="text-[13px] text-foreground-600 leading-none">
                (주말 및 공휴일 휴무)
              </span>

              <div className="mt-4">
                <span className="font-bold text-brand text-lg leading-none">TEL: 031-893-0806</span>
              </div>
              <div className="">
                <span className="font-bold text-brand text-lg leading-none">FAX: 031-893-0809</span>
              </div>
            </div>
          </div>
          {/* service */}
          <div className="w-full flex gap-8 items-stretch justify-between">
            <div className="flex flex-col">
              <span className="font-bold text-brand text-lg leading-none">택배주문 마감안내</span>
              <div className="w-full flex justify-end text-[13px] text-foreground-500">order</div>
            </div>
            {/* <div className="w-[1px] h-auto bg-foreground-100"></div> */}
            <div className="flex flex-col gap-2 items-end">
              <span className="text-[15px] text-foreground-600 leading-none">평일 14:00 까지</span>
              <span className="text-[13px] text-foreground-600 leading-none">
                (주말 및 공휴일 휴무)
              </span>
            </div>
          </div>
          {/* info */}
          <div className="w-full flex flex-col gap-2 p-4 rounded-md bg-neutral-50">
            <div className="flex gap-3 flex-col">
              <div className="flex flex-col gap-1">
                <span className="text-[15px] font-bold">의약품 도소매 전문</span>
                <span className="text-[13px] text-foreground-600">
                  주문관리를 위한 홈페이지입니다. 도메인을 확인해주세요
                </span>
              </div>
              <div className="flex gap-2 flex-col">
                <div className="w-full rounded-full flex items-center gap-1">
                  <Globe className="w-4 h-4 text-brandWeek" />
                  <span className="text-[15px] text-brandWeek font-medium">www.yooanmedi.com</span>
                </div>
                <div className="w-full rounded-full flex items-center gap-1">
                  <Mail className="w-4 h-4 text-brandWeek" />
                  <span className="text-[15px] text-brandWeek font-medium">
                    yooanmedi@gmil.com (일반)
                  </span>
                </div>
                <div className="w-full rounded-full flex items-center gap-1">
                  <Mail className="w-4 h-4 text-brandWeek" />
                  <span className="text-[15px] text-brandWeek font-medium">
                    simson19@hanmail.net (세금계산서용)
                  </span>
                </div>
              </div>
            </div>
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
  )
}

function PasswordFindContent() {
  return (
    <div className="flex flex-col">
      <p className="text-[15px] text-foreground-700">
        <span className="text-brand">비밀번호 찾기 클릭시</span> 고객에게 노출할 메세지가 들어갑니다
      </p>
    </div>
  )
}

function JoinContent() {
  return (
    <div className="flex flex-col">
      <p className="text-[15px] text-foreground-700">
        <span className="text-brand">회원가입 클릭시</span> 고객에게 노출할 메세지가 들어갑니다
      </p>
    </div>
  )
}

function ErrorContent() {
  return (
    <div className="flex flex-col">
      <p className="text-[15px] text-foreground-700">
        <span className="text-danger">아이디 또는 비밀번호가 일치하지 않습니다</span>
      </p>
    </div>
  )
}
