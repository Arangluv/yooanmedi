'use client'

import { OrderUserInfoContext } from '@order/_context/order_context'
import { useContext } from 'react'
import { formatNumberWithCommas } from '@order/utils'
import clsx from 'clsx'

export default function UserInfo({
  className = 'w-[calc((100%-1024px)/2)] pr-8',
}: {
  className?: string
}) {
  const { user } = useContext(OrderUserInfoContext)

  if (!user) {
    return null
  }

  return (
    <div className={clsx('flex h-full justify-end', className)}>
      <div className="flex flex-col items-end justify-center">
        <span className="text-brandWeek">
          <span className="font-bold mr-1">{user.hospitalName}</span>
          <span className="text-foreground-700">님</span>
        </span>
        <span className="text-sm text-foreground-600">
          보유 적립금 :{' '}
          <span className="font-bold text-brandWeek">{formatNumberWithCommas(user.point)}원</span>
        </span>
      </div>
    </div>
  )
}
