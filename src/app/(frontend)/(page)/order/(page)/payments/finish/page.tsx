'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Navbar from '@/app/(frontend)/(page)/order/(page)/_components/Navbar';
import PaymentsTitle from '@/app/(frontend)/(page)/order/(page)/_components/PaymentsTitle';
import Link from 'next/link';
import { CircleAlert, CircleCheckBig } from 'lucide-react';
import moment from 'moment';
import { formatNumberWithCommas } from '@/app/(frontend)/(page)/order/utils';
import { useEffect } from 'react';

export default function PaymentsFinishPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const status = searchParams.get('status');
  const message = searchParams.get('message');
  const amount = searchParams.get('amount');
  const approvalDate = searchParams.get('approvalDate');
  const shopOrderNo = searchParams.get('shopOrderNo');

  useEffect(() => {
    if (status === 'success') {
      router.refresh();
    }
  }, [status]);

  return (
    <div className="flex w-full flex-col">
      <Navbar />
      <ContentWrapper>
        <PaymentsTitle step="finish" />
        {status === 'success' ? (
          <OrderSuccessContent
            amount={amount || ''}
            approvalDate={approvalDate || ''}
            shopOrderNo={shopOrderNo || ''}
          />
        ) : (
          <OrderFailedContent message={message || ''} />
        )}
      </ContentWrapper>
    </div>
  );
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full items-center justify-center">
      <div className="flex w-5xl flex-col">{children}</div>
    </div>
  );
}

function OrderFailedContent({ message }: { message: string }) {
  return (
    <div className="flex h-[calc(100vh-469px)] w-full flex-col items-center justify-center gap-4 py-12">
      <span className="text-danger-400 flex items-center gap-1 text-lg font-bold">
        <CircleAlert className="h-6 w-6" />
        주문 처리 실패
      </span>
      <span>사유 : {message}</span>
      <Link
        href="/order"
        className="text-hover:bg-brandWeek bg-brand mt-8 rounded-md px-4 py-2 text-[15px] text-white transition-colors duration-300"
      >
        홈으로 돌아가기
      </Link>
    </div>
  );
}

function OrderSuccessContent({
  amount,
  approvalDate,
  shopOrderNo,
}: {
  amount: string;
  approvalDate: string;
  shopOrderNo: string;
}) {
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
          <span className="font-bold">{formatNumberWithCommas(Number(amount))}원</span>
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
}
