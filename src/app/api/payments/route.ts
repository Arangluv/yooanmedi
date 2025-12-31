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
      // shopValue5: 결제 방법 -> creditCard | bankTransfer

      const {
        authorizationId,
        shopOrderNo,
        shopValue1,
        shopValue2,
        shopValue3,
        shopValue4,
        shopValue5,
      } = data
      const userOrderRequest = shopValue1 as string
      const orderList = JSON.parse(shopValue2 as string)
      const usedPoint = shopValue3 as string
      const userId = shopValue4 as string

      const user = await payload.findByID({
        collection: 'users',
        id: Number(userId),
      })

      if (!user) {
        throw new Error('유저 정보 없음', { cause: { code: 'USER_NOT_FOUND' } })
      }

      const approveData = await approvePayment({ authorizationId, shopOrderNo })

      console.log('approveData')
      console.log(approveData)

      // OrderList를 생성 -> 얼마나 포인트를 적립했는지 반환
      const pointAmount = await createOrderList({
        payload,
        orderList,
        userId,
        userOrderRequest,
        approveData,
        usedPoint: Number(usedPoint),
        paymentsMethod: shopValue5 as 'creditCard' | 'bankTransfer',
        transactionID: dbTransactionID as string,
      })

      let userPoint = Number(user.point ?? 0)
      // 사용 적립금이 있다면 적립금 차감
      if (Number(usedPoint) > 0) {
        userPoint -= Number(usedPoint)

        await payload.create({
          collection: 'point-history',
          data: {
            user: Number(userId),
            type: 'use',
            reason: `적립금 사용 차감 - 상품주문번호 : ${approveData.shopOrderNo}`,
            balanceAfter: userPoint,
          },
          req: { transactionID: dbTransactionID as string },
        })
      }

      // 구매 적립금 적립
      if (pointAmount > 0) {
        userPoint += pointAmount

        await payload.create({
          collection: 'point-history',
          data: {
            user: Number(userId),
            type: 'earn',
            reason: `상품구매적립 - 상품주문번호 : ${approveData.shopOrderNo}`,
            balanceAfter: userPoint,
          },
          req: { transactionID: dbTransactionID as string },
        })
      }

      const roundedUserChangePoint = Math.floor(userPoint)
      if (roundedUserChangePoint) {
        await payload.update({
          collection: 'users',
          id: Number(userId),
          data: {
            point: roundedUserChangePoint,
          },
          req: { transactionID: dbTransactionID as string },
        })
      }
      // // 리다이렉트
      console.log('approveData')
      console.log(approveData)

      const url = request.nextUrl.clone()
      url.pathname = '/order/payments/result'
      url.searchParams.set('status', 'success')
      url.searchParams.set('approvalDate', approveData.paymentInfo.approvalDate)
      url.searchParams.set('amount', approveData?.amount.toString())
      url.searchParams.set('shopOrderNo', approveData.shopOrderNo)

      // 트랜잭션 커밋
      await payload.db.commitTransaction(dbTransactionID as string)
      return NextResponse.redirect(url, { status: 302 })
    } else {
      throw new Error('결제 실패', { cause: { code: data.resCd } })
    }
  } catch (error: any) {
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
  usedPoint,
  paymentsMethod,
  transactionID,
}: {
  payload: BasePayload
  orderList: any[]
  userId: string
  userOrderRequest: string
  approveData: PaymentApproveResponseDto
  usedPoint: number
  paymentsMethod: 'creditCard' | 'bankTransfer'
  transactionID: string
}) => {
  let pointAmount = 0
  const refundPoint = usedPoint > 0 ? Math.floor(usedPoint / orderList.length) : 0
  const refuntPointRemain = usedPoint > 0 ? usedPoint % orderList.length : 0
  const refundPointArr = Array.from({ length: orderList.length }, () => refundPoint)
  if (refuntPointRemain > 0) {
    refundPointArr[orderList.length - 1] += refuntPointRemain
  }

  await Promise.all(
    orderList.map(async (order: any, idx: number) => {
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
          refundUsedPointAmount: refundPointArr[idx],
          paymentsMethod: paymentsMethod,
          pgCno: approveData.pgCno,
          orderStatus: 1,
          orderRequest: userOrderRequest,
          // 실패케이스를 만들때  -> approveData.paymentInfo.approvalDate, 이것만 사용하기
          // orderCreatedAt: moment(
          //   approveData.paymentInfo.approvalDate,
          //   'YYYYMMDDHHmmss',
          // ).toISOString(),
        },
        req: { transactionID: transactionID as string },
      })
    }),
  )

  return Math.floor(pointAmount)
}
