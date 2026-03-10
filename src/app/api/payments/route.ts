import { NextRequest, NextResponse } from 'next/server'
import moment from 'moment'
import { generateRandomShopTransactionId } from '@order/utils'

type PaymentResponseType = {
  resCd: string
  authorizationId: string
  shopOrderNo: string
  shopValue1: string
  shopValue2: string
  shopValue3?: string
  shopValue4?: string
  shopValue5?: string
  shopValue6?: string
}

type PaymentApproveRequestDto = {
  mallId: string
  // 중복되지 않는 고유값, 요청시마다 생성
  shopTransactionId: string
  authorizationId: string
  shopOrderNo: string // 결제 등록시 생성한 주문번호 그대로 사용
  approvalReqDate: string // 결제 등록시 생성한 주문번호 그대로 사용
}

type PaymentApproveResponseDto = {
  resCd: string
  pgCno: string
  shopOrderNo: string
  amount: number
  paymentInfo: {
    approvalDate: string
  }
}

export async function POST(request: NextRequest) {
  try {
    let data = {} as PaymentResponseType
    const formData = await request.formData()
    formData.forEach((value: any, key: string) => {
      // @ts-ignore
      data[key as unknown as string] = value
    })

    if (data.resCd === '0000') {
      const { authorizationId, shopOrderNo, shopValue1, shopValue2, shopValue3 } = data
      const userOrderRequest = shopValue1 as string
      const orderList = JSON.parse(shopValue2 as string)
      const usedPoint = shopValue3 as string

      // 승인
      const approvalReqDate = moment().format('YYYYMMDD')
      const dto: PaymentApproveRequestDto = {
        mallId: process.env.PAYMENTS_MID as string,
        shopTransactionId: generateRandomShopTransactionId(),
        authorizationId: authorizationId,
        shopOrderNo: shopOrderNo,
        approvalReqDate: approvalReqDate,
      }

      const res = await fetch(process.env.PAYMENTS_APPROVAL_URL as string, {
        method: 'POST',
        body: JSON.stringify(dto),
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.log('결제 승인요청 시 에러 data')
        console.log(errorData)
        throw new Error('결제 승인요청 실패', { cause: { code: errorData.resCd } })
      }

      const approveData = await res.json()

      // 리다이렉트
      const url = request.nextUrl.clone()
      url.pathname = '/order/payments/result'
      url.searchParams.set('status', 'success')
      url.searchParams.set('approvalDate', approveData.paymentInfo.approvalDate)
      url.searchParams.set('amount', approveData.amount.toString())
      url.searchParams.set('shopOrderNo', approveData.shopOrderNo)

      return NextResponse.redirect(url, { status: 302 })
    } else {
      console.log('실패시 data')
      console.log(data)

      throw new Error('결제 실패', { cause: { code: data.resCd } })
    }
  } catch (error: any) {
    console.log('error')
    console.log(error)

    console.error('결제 콜백 처리 에러:')
    console.error(error.cause)

    const url = request.nextUrl.clone()
    url.pathname = '/order/payments/result'
    url.searchParams.set('status', 'error')
    url.searchParams.set('code', error.cause?.code || 'unknown')

    return NextResponse.redirect(url, { status: 302 })
  }
}
