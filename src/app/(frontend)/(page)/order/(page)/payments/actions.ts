'use server'

import { BasePayload, getPayload } from 'payload'
import config from '@/payload.config'
import moment from 'moment'

// 결제주문 등록 API -> 임시 테스트
// POST 요청
export async function registerOrder(orderInfo: any) {
  try {
    const dto = {
      mallId: process.env.PAYMENTS_MID,
      ...orderInfo,
    }

    const res = await fetch(process.env.PAYMENTS_REGISTER_URL as string, {
      method: 'POST',
      body: JSON.stringify(dto),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.log('결제주문 등록시 에러가 발생')
      console.log(errorData)
      return null
    }
    const data = await res.json()
    return data
  } catch (error) {
    return null
  }
}

type BankTransferDto = {
  amount: number
  shopOrderNo: string
  orderInfo: {
    goodsName: string
    customerInfo: {
      customerId: string
    }
  }
  shopValueInfo: {
    value1: string
    value2: string
    value3: string
    value4: string
    value5: 'bankTransfer'
  }
}
// {
//   amount: 216580,
//   shopOrderNo: '202512265819907',
//   orderInfo: {
//     goodsName: '(회)(생)오보덴스 프리필드시린지',
//     customerInfo: {
//       customerId: 'test0001',
//       customerName: '병원이름',
//       customerMail: 'test0002@gmail.com',
//       customerContactNo: '01012234567',
//       customerAddr: '서울 강남구 신사동 536-9 , 06035'
//     }
//   },
//   shopValueInfo: {
//     value1: '',
//     value2: '[{"id":9,"quantity":2}]',
//     value3: '0',
//     value4: '20',
//     value5: 'bankTransfer'
//   }
// }
export async function createBankTransferOrder(bankTransferDto: BankTransferDto) {
  const payload = await getPayload({ config: config })
  const dbTransactionID = await payload.db.beginTransaction()
  try {
    console.log('bankTransferDto')
    console.log(bankTransferDto)

    const { amount, shopOrderNo, shopValueInfo } = bankTransferDto
    const {
      value1: userOrderRequest,
      value2: orderList,
      value3: usedPoint,
      value4: userId,
      value5: paymentsMethod,
    } = shopValueInfo

    const user = await payload.findByID({
      collection: 'users',
      id: Number(userId),
    })

    // // 유저가 거래 취소 시 환불할 적립금을 관리하기 위해 사용
    // // 얼마나 포인트를 사용했는지를 저장
    // // 0 이상일 경우 환불 처리 -> 취소 로직에서
    const pointForTransation = await payload.create({
      collection: 'point-for-transation',
      select: {},
      data: {
        user: Number(userId),
        usedPointAmount: Number(usedPoint),
      },
    })

    // OrderList를 생성 -> 얼마나 포인트를 적립했는지 반환
    const pointAmount = await createOrderList({
      payload,
      orderList: JSON.parse(orderList as string),
      userId,
      userOrderRequest,
      pointForTransationId: pointForTransation.id,
      paymentsMethod: 'bankTransfer' as const,
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
          reason: `적립금 사용 차감 - 상품주문번호 : ${shopOrderNo}`,
          balanceAfter: userPoint,
        },
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
          reason: `상품구매적립 - 상품주문번호 : ${shopOrderNo}`,
          balanceAfter: userPoint,
        },
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
      })
    }

    await payload.db.commitTransaction(dbTransactionID as string)
    return {
      error: false,
      message: '무통장 입금 주문을 생성하였습니다.',
    }
  } catch (error) {
    await payload.db.rollbackTransaction(dbTransactionID as string)
    return {
      error: true,
      message: '무통장 입금 주문을 생성하는데 실패했습니다. 다시 시도해주세요.',
    }
  }
}

// 주문 리스트 생성
const createOrderList = async ({
  payload,
  orderList,
  userId,
  userOrderRequest,
  pointForTransationId,
  paymentsMethod,
}: {
  payload: BasePayload
  orderList: any[]
  userId: string
  userOrderRequest: string
  pointForTransationId: number
  paymentsMethod: 'creditCard' | 'bankTransfer'
}) => {
  let pointAmount = 0

  await Promise.all(
    orderList.map(async (order: any) => {
      const product = await payload.findByID({
        collection: 'product',
        id: order.id,
        select: {
          cashback_rate_for_bank: true,
          price: true,
        },
      })

      pointAmount += (product.cashback_rate_for_bank * order.quantity * product.price) / 100

      return await payload.create({
        collection: 'order',
        data: {
          user: Number(userId),
          product: order.id,
          quantity: order.quantity,
          orderCreatedAt: moment(new Date().toISOString(), 'YYYYMMDDHHmmss').toISOString(),
          pointForTransation: pointForTransationId,
          paymentsMethod: paymentsMethod,
          pgCno: null,
          orderStatus: 5,
          orderRequest: userOrderRequest,
        },
      })
    }),
  )

  return Math.floor(pointAmount)
}
