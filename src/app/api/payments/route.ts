import { NextRequest, NextResponse } from 'next/server'
import moment from 'moment'
import { generateRandomShopTransactionId } from '@order/utils'
import { BasePayload, getPayload } from 'payload'
import config from '@/payload.config'

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
  const payload = await getPayload({ config: config })
  const dbTransactionID = await payload.db.beginTransaction()

  try {
    let data = {} as PaymentResponseType
    const formData = await request.formData()
    formData.forEach((value: any, key: string) => {
      // @ts-ignore
      data[key as unknown as string] = value
    })

    if (data.resCd === '0000') {
      // shopValue1: 주문요청사항
      // shopValue2: 주문상품리스트
      // shopValue3: 사용 적립금
      // shopValue4: 유저ID(고유)

      const { authorizationId, shopOrderNo, shopValue1, shopValue2, shopValue3, shopValue4 } = data
      const userOrderRequest = shopValue1 as string
      const orderList = JSON.parse(shopValue2 as string)
      const usedPoint = shopValue3 as string
      const userId = shopValue4 as string

      const user = await payload.findByID({
        collection: 'users',
        id: Number(userId),
      })

      const approveData = await approvePayment({ authorizationId, shopOrderNo })

      const pointAmount = await createOrderList({
        payload,
        orderList,
        userId,
        userOrderRequest,
        approveData,
      })

      // 구매 적립금 적립
      if (pointAmount > 0) {
        await payload.create({
          collection: 'point-history',
          data: {
            user: Number(userId),
            type: 'earn',
            reason: `상품구매적립 #${approveData.shopOrderNo}`,
            balanceAfter: (user.point ?? 0) + pointAmount,
          },
        })
      }

      // 사용 적립금이 있다면 적립금 차감
      if (usedPoint) {
        await payload.create({
          collection: 'point-history',
          data: {
            user: Number(userId),
            type: 'use',
            reason: `상품구매차감 #${approveData.shopOrderNo}`,
            balanceAfter: (user.point ?? 0) - Number(usedPoint),
          },
        })
      }

      const userChangePoint = (user.point ?? 0) + pointAmount - Number(usedPoint)

      if (userChangePoint) {
        await payload.update({
          collection: 'users',
          id: Number(userId),
          data: {
            point: userChangePoint,
          },
        })
      }

      // 리다이렉트
      const url = request.nextUrl.clone()
      url.pathname = '/order/payments/result'
      url.searchParams.set('status', 'success')
      url.searchParams.set('approvalDate', approveData.paymentInfo.approvalDate)
      url.searchParams.set('amount', approveData.amount.toString())
      url.searchParams.set('shopOrderNo', approveData.shopOrderNo)

      // 트랜잭션 커밋
      await payload.db.commitTransaction(dbTransactionID as string)

      return NextResponse.redirect(url, { status: 302 })
    } else {
      throw new Error('결제 실패', { cause: { code: data.resCd } })
    }
  } catch (error: any) {
    console.log('결제 콜백 처리 에러')
    console.log(error)

    // payload에서 에러가 터지면 여기서도 이제 주문취소를 해야함

    const url = request.nextUrl.clone()
    url.pathname = '/order/payments/result'
    url.searchParams.set('status', 'error')
    url.searchParams.set('code', error.cause?.code || 'unknown')

    // 트랜잭션 롤백
    await payload.db.rollbackTransaction(dbTransactionID as string)
    return NextResponse.redirect(url, { status: 302 })
  }
}

// 결제 승인요청
const approvePayment = async ({
  authorizationId,
  shopOrderNo,
}: {
  authorizationId: string
  shopOrderNo: string
}) => {
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
    throw new Error('결제 승인요청 실패', { cause: { code: errorData.resCd } })
  }

  const approveData = (await res.json()) as PaymentApproveResponseDto

  return approveData
}

// 주문 리스트 생성
const createOrderList = async ({
  payload,
  orderList,
  userId,
  userOrderRequest,
  approveData,
}: {
  payload: BasePayload
  orderList: any[]
  userId: string
  userOrderRequest: string
  approveData: PaymentApproveResponseDto
}) => {
  let pointAmount = 0

  await Promise.all(
    orderList.map(async (order: any) => {
      const product = await payload.findByID({
        collection: 'product',
        id: order.id,
        select: {
          cashback_rate: true,
          price: true,
        },
      })

      pointAmount += (product.cashback_rate * order.quantity * product.price) / 100
      
      return await payload.create({
        collection: 'order',
        data: {
          user: Number(userId),
          product: order.id,
          quantity: order.quantity,
          orderCreatedAt: moment(
            approveData.paymentInfo.approvalDate,
            'YYYYMMDDHHmmss',
          ).toISOString(),
          // 실패케이스를 만들때  -> approveData.paymentInfo.approvalDate, 이것만 사용하기
          // orderCreatedAt: moment(
          //   approveData.paymentInfo.approvalDate,
          //   'YYYYMMDDHHmmss',
          // ).toISOString(),
          pgCno: approveData.pgCno,
          orderStatus: 1,
          orderRequest: userOrderRequest,
        },
      })
    }),
  )

  return pointAmount
}
