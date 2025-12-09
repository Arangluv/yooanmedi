'use client'

import { useEffect } from 'react'
import { useSearchParams } from 'next/navigation'

const errorCodeToMessage = {
  W324: '결제를 취소했습니다',
  W001: '결제를 취소했습니다',
}

export default function PaymentsResultPage() {
  const searchParams = useSearchParams()

  useEffect(() => {
    const code = searchParams.get('code')
    const status = searchParams.get('status')
    if (!status) {
      return
    }

    if (status === 'success') {
      const amount = searchParams.get('amount')
      const approvalDate = searchParams.get('approvalDate')
      const shopOrderNo = searchParams.get('shopOrderNo')

      const data = {
        status: 'success',
        message: '결제가 성공적으로 완료되었습니다',
        amount: amount,
        approvalDate: approvalDate,
        shopOrderNo: shopOrderNo,
      }

      window.opener.postMessage(data, '*')
      window.close()
    }

    if (status === 'error') {
      const errorMessage =
        errorCodeToMessage[code as keyof typeof errorCodeToMessage] ||
        '결제 요청을 처리하는데 문제가 발생했습니다'

      window.opener.postMessage(
        {
          status: 'error',
          message: errorMessage,
        },
        '*',
      )
      window.close()
    }
  }, [searchParams])

  return <div></div>
}
