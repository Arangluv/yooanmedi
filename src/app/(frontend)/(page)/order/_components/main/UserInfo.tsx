'use client';

import { OrderUserInfoContext } from '@/app/(frontend)/(page)/order/_context/order_context';
import { useContext } from 'react';
import { formatNumberWithCommas } from '@/app/(frontend)/(page)/order/utils';
import clsx from 'clsx';

export default function UserInfo({
  className = 'w-[calc((100%-1024px)/2)] pr-8',
}: {
  className?: string;
}) {
  const { user } = useContext(OrderUserInfoContext);

  if (!user) {
    return null;
  }

  return (
    <div className={clsx('flex h-full justify-end', className)}>
      <div className="flex flex-col items-end justify-center">
        <span className="text-brandWeek">
          <span className="mr-1 font-bold">{user.hospitalName}</span>
          <span className="text-foreground-700">님</span>
        </span>
        <span className="text-foreground-600 text-sm">
          보유 적립금 :{' '}
          <span className="text-brandWeek font-bold">{formatNumberWithCommas(user.point)}원</span>
        </span>
      </div>
    </div>
  );
}
