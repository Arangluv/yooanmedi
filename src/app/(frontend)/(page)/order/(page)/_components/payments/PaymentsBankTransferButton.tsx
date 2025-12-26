'use client'

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react'
import { Info } from 'lucide-react'
import Link from 'next/link'
import { createBankTransferOrder } from '../../payments/actions'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

type BankTransferDto = {
  amount: number
  shopOrderNo: string
  orderInfo: {
    goodsName: string
    customerInfo: {
      customerId: string
    }
  }
  shopValueInfo: {
    value1: string
    value2: string
    value3: string
    value4: string
    value5: 'bankTransfer'
  }
}

export default function PaymentsBankTransferButton({
  isDisabled,
  bankTransferDto,
}: {
  isDisabled: boolean
  bankTransferDto: BankTransferDto
}) {
  const { isOpen, onOpen } = useDisclosure()
  const router = useRouter()
  const { mutate: createBankTransferOrderMutation, isPending } = useMutation({
    mutationFn: () => createBankTransferOrder(bankTransferDto),
    onSuccess: () => {
      onOpen()
    },
    onError: () => {
      alert('무통장 입금 주문을 생성하는데 실패했습니다. 다시 시도해주세요.')
    },
  })

  const handleBankBtnClick = () => {
    createBankTransferOrderMutation()
  }

  return (
    <>
      <Button
        size="lg"
        className="bg-brand text-white w-full"
        radius="sm"
        isDisabled={isDisabled}
        isLoading={isPending}
        onPress={handleBankBtnClick}
      >
        무통장 입금
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={(open) => {
          if (!open) {
            router.push('/order/list')
          }
        }}
        size="xl"
      >
        <ModalContent>
          <ModalHeader>무통장입금 결제 정보</ModalHeader>
          <ModalBody>
            <div className="w-full flex flex-col gap-1">
              <p className="text-green-600 font-bold">주문이 완료되었습니다</p>
              <p>
                현재 주문은 처리 되었지만 <span className="text-brand font-bold">'결제대기'</span>{' '}
                상태입니다
              </p>
              <p>
                <span className="font-bold">입금 확인 후 주문처리가 완료</span>됩니다.
              </p>
              <div className="bg-neutral-50  flex flex-col my-4 p-4 rounded-md">
                <span className="flex gap-1 items-center mb-3">
                  <Info className="w-4 h-4" />
                  <span>입금 계좌 정보</span>
                </span>
                <span className="mb-1 font-bold">예금주 : 유안메디팜</span>
                <span className="mb-1 font-bold">은행 : 우리은행</span>
                <span className="font-bold">계좌번호 : 1005-504-652055</span>
              </div>
              <p>
                주문내역에 대한 자세한 내용은{' '}
                <Link
                  href="/order/list"
                  prefetch={false}
                  className="text-brand font-bold hover:text-brandWeek transition-colors duration-300"
                >
                  이곳
                </Link>
                에서 확인하실 수 있습니다
              </p>
            </div>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
