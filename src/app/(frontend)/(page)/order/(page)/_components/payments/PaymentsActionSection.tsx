'use client'

import { Button, Divider, NumberInput } from '@heroui/react'
import { ChevronRight } from 'lucide-react'
import { formatNumberWithCommas } from '@order/utils'
import { registerOrder } from '@order/(page)/payments/actions'
import { useMutation } from '@tanstack/react-query'
import { useContext, useEffect, useState } from 'react'
import { InventoryContext, OrderUserInfoContext } from '@order/_context/order_context'
import Link from 'next/link'

export default function PaymentsActionSection() {
  const { inventory } = useContext(InventoryContext)
  const { user } = useContext(OrderUserInfoContext)
  const [usePoint, setUsePoint] = useState(0)
  const [totalPaymentAmount, setTotalPaymentAmount] = useState(0)

  const totalPrice = inventory.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const totalDeliveryFee = inventory.reduce((acc, item) => acc + item.product.delivery_fee, 0)
  const totalExpectedPrice = totalPrice + totalDeliveryFee

  useEffect(() => {
    setTotalPaymentAmount(totalExpectedPrice - usePoint)
  }, [usePoint, totalExpectedPrice])

  const dto = {
    mallId: 'T0021766',
    payMethodTypeCode: '11',
    currency: '00',
    amount: 122000,
    clientTypeCode: '00',
    returnUrl: 'http://localhost:3000/order/payments/result',
    deviceTypeCode: 'mobile',
    shopOrderNo: '20251207test',
    orderInfo: {
      goodsName: '케라시스 데미지 클리닉 단백질 샴푸',
    },
  }

  const openPaymentPopup = (authPageUrl: string) => {
    if (!authPageUrl) {
      alert('결제 주문 등록 실패')
      return
    }

    const width = 600
    const height = 680
    const left = window.screen.width / 2 - width / 2
    const top = window.screen.height / 2 - height / 2

    const popup = window.open(
      authPageUrl,
      'payment',
      `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
    )

    if (!popup) {
      alert('팝업이 차단되었습니다. 팝업 차단을 해제해주세요.')
      return
    }
  }
  const { mutate: registerOrderMutation } = useMutation({
    mutationFn: () => registerOrder(dto),
    onSuccess: (data) => {
      openPaymentPopup(data.authPageUrl as string)
    },
    onError: (error) => {},
  })
  if (!user) {
    return null
  }

  return (
    <div
      className="w-full rounded-md p-4 flex flex-col gap-6"
      style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)' }}
    >
      <div className="flex flex-col gap-4">
        <span className="text-xl font-bold">최종 결제 금액</span>
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between">
            <span className="text-foreground-600">총 금액</span>
            <span className="font-bold">{formatNumberWithCommas(totalPrice)}원</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-foreground-600">배송비</span>
            <span className="font-bold">{formatNumberWithCommas(totalDeliveryFee)}원</span>
          </div>
          <div className="flex justify-between">
            <span className="text-foreground-600">적립금 사용</span>
            <div className="flex flex-col items-end">
              <NumberInput
                size="sm"
                radius="sm"
                aria-label="적립금 사용"
                variant="bordered"
                isDisabled={user.point === 0 || user.point === null || inventory.length === 0}
                hideStepper
                value={usePoint}
                minValue={0}
                maxValue={user.point ?? 0}
                onValueChange={(value) => {
                  setUsePoint(value)
                }}
                description={
                  <span className="text-[14px] text-brand">
                    (사용가능 적립금 {formatNumberWithCommas(user.point ?? 0)}원)
                  </span>
                }
                classNames={{
                  inputWrapper: 'border-1 border-foreground-200 shadow-none h-8',
                  description: 'flex justify-end',
                }}
              />
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">총 결제 금액</span>
          <span className="font-bold text-brand text-xl">
            {formatNumberWithCommas(totalPaymentAmount)}원
          </span>
        </div>
        <Link
          href="/terms?type=terms"
          target="_blank"
          className="flex justify-between items-center text-foreground-600 text-sm hover:text-foreground-800 transition-all duration-300"
        >
          <span> 서비스 이용약관 동의 </span>
          <span>
            <ChevronRight className="w-4 h-4" />
          </span>
        </Link>
        <Divider />
        <p className="text-foreground-600 text-sm">
          위 주문 내용을 확인하였으며 회원 본인은 개인정보 이용 및 서비스 이용약관에 동의합니다.
        </p>
        <Button
          size="lg"
          radius="sm"
          isDisabled={totalPaymentAmount <= 0}
          className="bg-brand text-white"
          onPress={() => registerOrderMutation()}
        >
          주문하기
        </Button>
      </div>
    </div>
  )
}
