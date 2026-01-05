'use client'

import { toast, useSelection, useListQuery } from '@payloadcms/ui'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatusToCancel } from './actions'

interface SelectedData {
  id: number
  user: number
  product: number
  orderCreatedAt: string
  paymentsMethod: string
  pgCno: string | null
  quantity: number
  orderStatus: number
  orderRequest: string
  refundUsedPointAmount: number
  updatedAt: string
  createdAt: string
}

type SelectedDataForCancel = {
  bankTransferData: SelectedData[]
  cardData: SelectedData[]
}

export default function OrderCancelButton() {
  const router = useRouter()
  const [disabledMessage, setDisabledMessage] = useState('')
  const [selectedData, setSelectedData] = useState<SelectedDataForCancel>({
    bankTransferData: [],
    cardData: [],
  })
  const { selected, toggleAll } = useSelection()
  const { data: listData } = useListQuery()

  const { mutate: updateOrderStatusToCancelMutation } = useMutation({
    mutationFn: (data: SelectedDataForCancel) => updateOrderStatusToCancel(data),
    onSuccess: (data: { message: string; success: boolean }) => {
      if (data.success) {
        toast.success(data.message)
        toggleAll()
        router.refresh()
      } else {
        toast.error(data.message)
      }
    },
    onError: () => {
      toast.error('주문취소 단계로 변경에 실패했습니다.')
    },
  })
  useEffect(() => {
    if (listData && listData.docs.length > 0) {
      const keys = Array.from(selected.entries())
        .filter(([_, value]) => value)
        .map(([key, _]) => key)

      const filterdData = listData.docs.filter((doc) => keys.includes(doc.id))
      const bankTransferData = filterdData.filter((doc) => doc.paymentsMethod === 'bankTransfer')
      const cardData = filterdData.filter((doc) => doc.paymentsMethod === 'creditCard')
      const isIncludeNotValidStatus = filterdData.some(
        (doc) => doc.orderStatus === 1 || doc.orderStatus === 5,
      )
      const isExistCancelStatus = filterdData.some((doc) => doc.orderStatus === 4)

      if (isIncludeNotValidStatus) {
        setDisabledMessage(
          '주문상태가 결제대기 또는 상품준비 단계가 아닌 주문이 포함되어 있습니다. 해당 주문은 유저가 직접 변경해야 합니다. (로그인 > 주문내역에서 확인가능합니다)',
        )

        return
      }

      if (isExistCancelStatus) {
        setDisabledMessage('이미 주문취소 단계로 변경된 주문이 포함되어 있습니다.')
        return
      }

      if (filterdData.length === 0) {
        setDisabledMessage('선택된 주문이 없습니다. 주문을 선택해주세요.')
        return
      }

      setDisabledMessage('')
      setSelectedData({
        bankTransferData: bankTransferData,
        cardData: cardData,
      })
    }
  }, [selected, listData])

  const onClick = () => {
    if (disabledMessage) {
      alert(disabledMessage)
      return
    }

    updateOrderStatusToCancelMutation(selectedData)
  }

  return (
    <div>
      <button
        className="bg-red-500 text-white px-3 py-1 rounded-md cursor-pointer"
        onClick={onClick}
      >
        주문취소 단계로 변경
      </button>
    </div>
  )
}
