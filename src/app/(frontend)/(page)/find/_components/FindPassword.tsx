'use client'

import {
  Button,
  Form,
  Input,
  Modal,
  ModalBody,
  ModalHeader,
  ModalContent,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { useState } from 'react'
import { findId, findIdToResetPassword, resetPassword } from '../actions'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'

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

export default function FindPassword() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [step, setStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  // Target to reset password
  const [result, setResult] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { mutate: findIdMutation } = useMutation({
    mutationFn: (dto: { username: string; hospitalName: string; nursingNumber: string }) =>
      findIdToResetPassword(dto),
    onSuccess: (data) => {
      if (!data.success) {
        setErrorMessage(data.message)
        onOpen()
        setIsLoading(false)
        return
      }
      setResult(data.username as string)
      setIsLoading(false)
      setStep(2)
    },
    onError: (error) => {
      setErrorMessage(error.message as string)
      onOpen()
      setIsLoading(false)
    },
  })

  const { mutate: resetPasswordMutation } = useMutation({
    mutationFn: (dto: { username: string; password: string }) => resetPassword(dto),
    onSuccess: () => {
      setIsLoading(false)
      setStep(3)
    },
    onError: (error) => {
      setErrorMessage(error.message as string)
      onOpen()
      setIsLoading(false)
    },
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const dto = Object.fromEntries(formData)
    findIdMutation(
      dto as {
        hospitalName: string
        nursingNumber: string
        username: string
      },
    )
  }
  return (
    <>
      <div className="w-full min-h-[calc(100vh-682px)]">
        {step === 1 ? (
          <FirstStep onSubmit={onSubmit} isLoading={isLoading} />
        ) : step === 2 ? (
          <ChangePasswordStep
            result={result}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
            resetPasswordMutation={resetPasswordMutation}
          />
        ) : (
          <ResultStep result={result} />
        )}
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          <ModalHeader>
            <span className="text-foreground-800 text-lg font-bold">알림</span>
          </ModalHeader>
          <ModalBody>
            <span className="text-foreground-600 whitespace-pre-wrap">{errorMessage}</span>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function FirstStep({
  onSubmit,
  isLoading,
}: {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
}) {
  return (
    <Form className="w-full flex flex-col gap-6" onSubmit={onSubmit}>
      <Input
        name="username"
        label="아이디"
        placeholder="아이디를 입력해주세요."
        {...inputProps}
        validate={(value: string) => {
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
        name="nursingNumber"
        label="요양기관번호"
        placeholder="요양기관번호를 입력해주세요."
        description="8자리 숫자로 입력해주세요. (예: 12345678)"
        type="number"
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
      <Button
        type="submit"
        className="w-full bg-brand text-white mt-4"
        radius="sm"
        size="lg"
        isLoading={isLoading}
      >
        유저 조회
      </Button>
    </Form>
  )
}

function ChangePasswordStep({
  result,
  isLoading,
  setIsLoading,
  resetPasswordMutation,
}: {
  result: string
  isLoading: boolean
  setIsLoading: (value: boolean) => void
  resetPasswordMutation: any
}) {
  const [errors, setErrors] = useState<{ password: string; passwordConfirm: string }>({
    password: '',
    passwordConfirm: '',
  })

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const dto = Object.fromEntries(formData)

    if (dto.password !== dto.passwordConfirm) {
      setErrors({
        password: '비밀번호가 일치하지 않습니다.',
        passwordConfirm: '비밀번호가 일치하지 않습니다.',
      })
      setIsLoading(false)
      return
    }

    resetPasswordMutation({
      username: result,
      password: dto.password as string,
    })
    setIsLoading(false)
  }
  return (
    <Form className="w-full flex flex-col gap-6" onSubmit={onSubmit} validationErrors={errors}>
      <Input
        name="password"
        label="새 비밀번호"
        placeholder="새 비밀번호를 입력해주세요."
        type="password"
        {...inputProps}
        onValueChange={(value) => {
          setErrors({
            password: '',
            passwordConfirm: '',
          })
        }}
        validate={(value: string) => {
          if (!value) {
            return '비밀번호를 입력해주세요.'
          }
          if (value.length < 5 || value.length > 25) {
            return '비밀번호는 5자 이상 25자 이하로 입력해주세요.'
          }
          return true
        }}
      />
      <Input
        name="passwordConfirm"
        label="비밀번호 확인"
        placeholder="비밀번호를 다시 입력해주세요."
        type="password"
        {...inputProps}
        onValueChange={(value) => {
          setErrors({
            password: '',
            passwordConfirm: '',
          })
        }}
        validate={(value: string) => {
          if (!value) {
            return '비밀번호를 입력해주세요.'
          }
          if (value.length < 5 || value.length > 25) {
            return '비밀번호는 5자 이상 25자 이하로 입력해주세요.'
          }
          return true
        }}
      />
      <Button
        type="submit"
        className="w-full bg-brand text-white mt-4"
        radius="sm"
        size="lg"
        isLoading={isLoading}
      >
        비밀번호 재설정
      </Button>
    </Form>
  )
}

function ResultStep({ result }: { result: string }) {
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <span className="text-foreground-800">비밀번호가 재설정 되었습니다.</span>
      <Link href="/" className="text-brand px-6 py-2 rounded-md bg-brandWeek text-white">
        홈으로 바로가기
      </Link>
    </div>
  )
}
