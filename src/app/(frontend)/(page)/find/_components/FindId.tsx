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
import { findId } from '../actions'
import { useMutation } from '@tanstack/react-query'

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

export default function FindId() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()
  const [step, setStep] = useState<number>(1)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [result, setResult] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const { mutate: findIdMutation } = useMutation({
    mutationFn: (dto: {
      hospitalName: string
      businessNumber: string
      nursingNumber: string
      phoneNumber: string
    }) => findId(dto),
    onSuccess: (data) => {
      if (!data.success) {
        setErrorMessage(data.message)
        onOpen()
        setIsLoading(false)
        return
      }
      setResult(data.username as string)
      setStep(2)
      setIsLoading(false)
    },
    onError: () => {
      setErrorMessage('아이디 찾기 도중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
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
        businessNumber: string
        nursingNumber: string
        phoneNumber: string
      },
    )
  }
  return (
    <>
      <div className="w-full min-h-[calc(100vh-682px)]">
        {step === 1 ? (
          <FirstStep onSubmit={onSubmit} isLoading={isLoading} />
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
        name="businessNumber"
        label="사업자등록번호"
        placeholder="사업자등록번호를 입력해주세요."
        description="10자리 숫자로 입력해주세요. (예: 1234567890)"
        type="number"
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
      <Input
        name="phoneNumber"
        label="전화번호"
        placeholder="전화번호를 입력해주세요."
        description="예: 01012345678"
        type="number"
        validate={(value: string) => {
          if (!value) {
            return '전화번호를 입력해주세요.'
          }
          if (value.length !== 11 || isNaN(Number(value))) {
            return '전화번호는 11자리 숫자로 입력해주세요.'
          }
          return true
        }}
        {...inputProps}
      />
      <Button
        type="submit"
        className="w-full bg-brand text-white mt-4"
        radius="sm"
        size="lg"
        isLoading={isLoading}
      >
        아이디 찾기
      </Button>
    </Form>
  )
}

function ResultStep({ result }: { result: string }) {
  return (
    <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
      <span className="text-foreground-800 text-lg font-bold">아이디 찾기 결과</span>
      <span className="text-foreground-600 whitespace-pre-wrap">
        현재 사용중인 아이디는 <span className="text-brandWeek font-medium">{result}</span> 입니다.
      </span>
    </div>
  )
}
