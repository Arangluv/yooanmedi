'use client'
import { toast, useSelection, useListQuery } from '@payloadcms/ui'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { updateOrderStatus } from './actions'
import { useRouter } from 'next/navigation'

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
  price: number
  cashback_rate_for_bank: number
  delivery_fee: number
}

export default function OrderPaymentPendingToReadyButton() {
  const router = useRouter()
  const [disabledMessage, setDisabledMessage] = useState('')
  const [selectedData, setSelectedData] = useState<SelectedData[]>([])
  const { selected, toggleAll } = useSelection()
  const { data: listData } = useListQuery()

  const { mutate: updateOrderStatusMutation } = useMutation({
    mutationFn: (data: SelectedData[]) => updateOrderStatus(data),
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
      toast.error('상품준비 단계로 변경에 실패했습니다.')
    },
  })

  useEffect(() => {
    if (listData && listData.docs.length > 0) {
      const keys = Array.from(selected.entries())
        .filter(([_, value]) => value)
        .map(([key, _]) => key)
      const filterdData = listData.docs.filter((doc) => keys.includes(doc.id))
      const isIncludeCard = filterdData.some((doc) => doc.paymentsMethod === 'creditCard')
      const isIncludeNotValidStatus = filterdData.some((doc) => doc.orderStatus !== 5)
      if (isIncludeCard) {
        setDisabledMessage(
          '신용카드 결제 주문이 포함되어 있습니다. 무통장 입금 주문만 상품준비 단계로 변경할 수 있습니다.',
        )
        return
      }

      if (isIncludeNotValidStatus) {
        setDisabledMessage(
          '주문상태가 결제대기가 아닌 주문이 포함되어 있습니다. 결제대기 주문만 상품준비 단계로 변경할 수 있습니다.',
        )
        return
      }

      if (filterdData.length === 0) {
        setDisabledMessage('선택된 주문이 없습니다. 주문을 선택해주세요.')
        return
      }

      setDisabledMessage('')
      setSelectedData(filterdData)
    }
  }, [selected, listData])

  const onClick = () => {
    if (disabledMessage) {
      alert(disabledMessage)
      return
    }

    updateOrderStatusMutation(selectedData)
  }

  return (
    <div>
      <button className="bg-brand text-white px-3 py-1 rounded-md cursor-pointer" onClick={onClick}>
        상품준비 단계로 변경 (무통장입금)
      </button>
    </div>
  )
}
