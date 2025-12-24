'use client'

import moment from 'moment'
import { formatNumberWithCommas } from '@order/utils'
import clsx from 'clsx'
import { Button } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { cancelOrder } from '../actions'

export type OrderListType = {
  id: number
  user: {
    id: number
    username: string
  }
  product: {
    id: number
    name: string
    manufacturer: string
    specification: string
    price: number
  }
  quantity: number
  orderCreatedAt: string
  pgCno: string
  orderStatus: {
    id: number
    name: string
  }
  deliveryCompany: string | null
}

export function ListBodySection({ data }: { data: OrderListType[] }) {
  console.log('data')
  console.log(data)

  return (
    <>
      {data.map((item: OrderListType, index: number) => {
        return (
          <tr key={item.id} className="border-t-1 border-foreground-200 text-sm">
            <td className="text-center py-2">{index + 1}</td>
            <td className="text-center">{moment(item.orderCreatedAt).format('YYYY-MM-DD')}</td>
            <td className="text-center">{item.product.manufacturer}</td>
            <td className="text-center">{item.product.name}</td>
            <td className="text-center">{formatNumberWithCommas(item.product.price)}원</td>
            <td className="text-center">{item.quantity}</td>
            <td className="text-center">
              {formatNumberWithCommas(item.product.price * item.quantity)}원
            </td>
            <td className="text-center">
              <OrderStatus id={item.orderStatus.id} name={item.orderStatus.name} />
            </td>
            <td className="text-center">
              <div className="mx-auto w-fit">
                <OrderCancelButton orderId={item.id} id={item.orderStatus.id} />
              </div>
            </td>
          </tr>
        )
      })}
    </>
  )
}

export function ListEmptyBody() {
  return (
    <tr>
      <td
        colSpan={10}
        className="text-center py-[200px] border-1 border-t-none border-foreground-200 text-foreground-600"
      >
        주문내역이 없습니다.
      </td>
    </tr>
  )
}

export function OrderStatus({ id, name }: { id: number; name: string }) {
  // const status = {
  //   1: '상품준비',
  //   2: '배송시작',
  //   3: '배송완료',
  //   4: '주문취소',
  // }

  const bgColorMap = {
    1: 'bg-neutral-200',
    2: 'bg-primary-50',
    3: 'bg-success-50',
    4: 'bg-danger-50',
  }

  const textColorMap = {
    1: 'text-foreground-700',
    2: 'text-primary-600',
    3: 'text-success-600',
    4: 'text-danger-500',
  }
  const bgColor = bgColorMap[id as keyof typeof bgColorMap]
  const textColor = textColorMap[id as keyof typeof textColorMap]

  return (
    <div className={clsx('mx-auto w-fit px-2 py-1 rounded-md', bgColor)}>
      <span className={clsx('text-xs', textColor)}>{name}</span>
    </div>
  )
}

function OrderCancelButton({ orderId, id }: { orderId: number; id: number }) {
  const { mutate: cancelOrderMutation } = useMutation({
    mutationFn: ({ orderId }: { orderId: number }) => cancelOrder({ orderId }),
    onSuccess: () => {
      toast.success('주문취소가 완료되었습니다.')
    },
    onError: () => {
      toast.error('주문취소에 실패했습니다.')
    },
  })

  const status = {
    1: false,
    2: true,
    3: true,
    4: true,
  }

  const handleCancel = ({ orderId }: { orderId: number }) => {
    const isOk = confirm('주문을 취소하시겠습니까?')

    if (isOk) {
      cancelOrderMutation({ orderId })
    }
  }

  return (
    <div className="mx-auto w-fit">
      <Button
        size="sm"
        radius="sm"
        onPress={() => handleCancel({ orderId: orderId })}
        isDisabled={status[id as keyof typeof status]}
        className="bg-danger-500 text-white rounded-md text-xs !w-fit !max-w-fit !py-1 !px-2"
      >
        주문취소
      </Button>
    </div>
  )
}
