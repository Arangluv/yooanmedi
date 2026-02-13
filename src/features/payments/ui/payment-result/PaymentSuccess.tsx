'use client';

import Link from 'next/link';

import { CircleCheckBig } from 'lucide-react';
import moment from 'moment';

import { formatNumberWithCommas } from '@/shared';
import useAuthStore from '@/entities/user/model/useAuthStore';
import { useEffect } from 'react';

const PaymentSuccess = ({
  amount,
  approvalDate,
  shopOrderNo,
}: {
  amount: number;
  approvalDate: string;
  shopOrderNo: string;
}) => {
  const refreshUser = useAuthStore((state) => state.refreshUser);

  useEffect(() => {
    refreshUser();
  }, []);

  return (
    <div className="flex h-[calc(100vh-469px)] w-full flex-col items-center justify-center gap-4 py-12">
      <span className="text-success-500 flex items-center gap-1 text-xl font-bold">
        <CircleCheckBig className="h-6 w-6" />
        주문 처리가 완료되었습니다
      </span>
      <div className="border-foreground-200 mt-4 flex w-1/2 flex-col gap-2 rounded-md border-1 p-4">
        <div className="flex w-full items-center justify-between">
          <span className="text-foreground-600">거래 번호 :</span>
          <span>{shopOrderNo}</span>
        </div>
        <div className="flex w-full items-center justify-between">
          <span className="text-foreground-600">결제 일시 :</span>
          <span>
            {approvalDate
              ? moment(approvalDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
              : ''}
          </span>
        </div>
        <div className="flex w-full items-center justify-between">
          <span className="text-foreground-600">결제 금액 :</span>
          <span className="font-bold">{formatNumberWithCommas(amount)}원</span>
        </div>
      </div>
      <Link
        href="/order/list"
        className="bg-brand hover:bg-brandWeek flex h-12 w-1/2 items-center justify-center rounded-md text-white transition-colors duration-300"
      >
        주문내역 확인하기
      </Link>
    </div>
  );
};

export default PaymentSuccess;
