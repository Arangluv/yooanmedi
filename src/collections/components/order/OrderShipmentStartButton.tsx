'use client'

import { toast, useSelection, useListQuery } from '@payloadcms/ui'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateOrderStatusToShipmentStart } from './actions'

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

export default function OrderShipmentStartButton() {
  const router = useRouter()
  const [disabledMessage, setDisabledMessage] = useState('')
  const [selectedData, setSelectedData] = useState<SelectedData[]>([])
  const { selected, toggleAll } = useSelection()
  const { data: listData } = useListQuery()

  const { mutate: updateOrderStatusToShipmentStartMutation } = useMutation({
    mutationFn: (data: SelectedData[]) => updateOrderStatusToShipmentStart(data),
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
      toast.error('배송 시작 단계로 변경에 실패했습니다.')
    },
  })
  useEffect(() => {
    if (listData && listData.docs.length > 0) {
      const keys = Array.from(selected.entries())
        .filter(([_, value]) => value)
        .map(([key, _]) => key)

      const filterdData = listData.docs.filter((doc) => keys.includes(doc.id))
      const isIncludeNotValidStatus = filterdData.some((doc) => doc.orderStatus !== 1)

      if (isIncludeNotValidStatus) {
        setDisabledMessage(
          '주문상태가 상품준비 단계가 아닌 주문이 포함되어 있습니다. 상품준비 단계 주문만 배송 시작할 수 있습니다.',
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

    updateOrderStatusToShipmentStartMutation(selectedData)
  }

  return (
    <div>
      <button
        className="bg-orange-500 text-white px-3 py-1 rounded-md cursor-pointer"
        onClick={onClick}
      >
        배송 시작 단계로 변경
      </button>
    </div>
  )
}
