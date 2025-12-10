'use client'

import { useSearchParams } from 'next/navigation'
import Navbar from '@order/(page)/_components/Navbar'
import PaymentsTitle from '@order/(page)/_components/PaymentsTitle'
import Link from 'next/link'
import { CircleAlert, CircleCheckBig } from 'lucide-react'
import moment from 'moment'
import { formatNumberWithCommas } from '@order/utils'

export default function PaymentsFinishPage() {
  const searchParams = useSearchParams()
  const status = searchParams.get('status')
  const message = searchParams.get('message')
  const amount = searchParams.get('amount')
  const approvalDate = searchParams.get('approvalDate')
  const shopOrderNo = searchParams.get('shopOrderNo')

  return (
    <div className="w-full flex flex-col">
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
  )
}

function ContentWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-5xl flex flex-col">{children}</div>
    </div>
  )
}

function OrderFailedContent({ message }: { message: string }) {
  return (
    <div className="w-full flex items-center justify-center flex-col gap-4 py-12 h-[calc(100vh-469px)]">
      <span className="text-danger-400 text-lg font-bold flex items-center gap-1">
        <CircleAlert className="w-6 h-6" />
        주문 처리 실패
      </span>
      <span>사유 : {message}</span>
      <Link
        href="/order"
        className="text-hover:bg-brandWeek transition-colors duration-300 text-[15px] px-4 py-2 rounded-md bg-brand text-white mt-8"
      >
        홈으로 돌아가기
      </Link>
    </div>
  )
}

function OrderSuccessContent({
  amount,
  approvalDate,
  shopOrderNo,
}: {
  amount: string
  approvalDate: string
  shopOrderNo: string
}) {
  return (
    <div className="w-full flex items-center justify-center flex-col gap-4 py-12 h-[calc(100vh-469px)]">
      <span className="text-success-500 text-xl font-bold flex items-center gap-1">
        <CircleCheckBig className="w-6 h-6" />
        주문 처리가 완료되었습니다
      </span>
      <div className="flex flex-col gap-2 p-4 w-1/2 border-1 border-foreground-200 rounded-md mt-4">
        <div className="w-full flex items-center justify-between">
          <span className="text-foreground-600">거래 번호 :</span>
          <span>{shopOrderNo}</span>
        </div>
        <div className="w-full flex items-center justify-between">
          <span className="text-foreground-600">결제 일시 :</span>
          <span>
            {approvalDate
              ? moment(approvalDate, 'YYYYMMDDHHmmss').format('YYYY-MM-DD HH:mm:ss')
              : ''}
          </span>
        </div>
        <div className="w-full flex items-center justify-between">
          <span className="text-foreground-600">결제 금액 :</span>
          <span className="font-bold">{formatNumberWithCommas(Number(amount))}원</span>
        </div>
      </div>
      <Link
        href="/order"
        className="text-white bg-brand w-1/2 h-12 flex items-center justify-center rounded-md hover:bg-brandWeek transition-colors duration-300"
      >
        주문내역 확인하기
      </Link>
    </div>
  )
}
