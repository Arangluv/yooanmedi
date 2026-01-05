'use server'

import { getPayload, Where } from 'payload'
import config from '@/payload.config'
import moment from 'moment-timezone'
import { generateRandomShopTransactionId } from '@order/utils'
import crypto from 'crypto'

export async function getOrderList({
  userId,
  start,
  end,
  productName,
}: {
  userId: string
  start: string
  end: string
  productName: string
}) {
  const payload = await getPayload({ config: config })
  const startDate = new Date(start).toISOString()
  const endDate = moment().endOf('day').toISOString()

  let productIds: string[] | undefined
  if (productName && productName.trim() !== '') {
    const products = await payload.find({
      collection: 'product',
      where: {
        name: {
          contains: productName,
        },
        
      },
      limit: 0,
    })
    productIds = products.docs.map((doc) => doc.id.toString())

    // productName으로 검색된 결과가 없으면 빈 배열 반환
    if (productIds.length === 0) {
      return []
    }
  }

  // where 조건 구성
  const where: Where = {
    user: {
      equals: userId,
    },
    orderCreatedAt: {
      greater_than_equal: startDate,
      less_than_equal: endDate,
    },
  }

  if (productIds && productIds.length > 0) {
    where.product = {
      in: productIds,
    }
  }

  const data = await payload.find({
    collection: 'order',
    select: {
      id: true,
      deliveryCompany: true,
      orderCreatedAt: true,
      orderStatus: true,
      paymentsMethod: true,
      pgCno: true,
      quantity: true,
      product: true,
      user: true,
    },
    populate: {
      product: {
        manufacturer: true,
        specification: true,
        name: true,
        price: true,
      },
      users: {
        username: true,
      },
    },
    limit: 0,
    sort: "-orderCreatedAt",
    where: where,
  })

  return data.docs
}

type CancelCardProductType = {
  id: number
  price: number
  cashback_rate: number
  delivery_fee: number
}

type CancelCardUserType = {
  id: number
  point: number
}

type CancelCardOrderType = {
  id: number
  product: CancelCardProductType
  user: CancelCardUserType
  quantity: number
  refundUsedPointAmount: number
  pgCno: string
}

export async function cancelOrderForCard({ orderId }: { orderId: number }): Promise<{ success: boolean; message: string; userPoint?: number }> {
  const payload = await getPayload({ config: config })
  const dbTransactionID = await payload.db.beginTransaction()
  try {
    let userPoint = null
    const order = (await payload.findByID({
      collection: 'order',
      id: orderId,
      select: {
        pgCno: true,
        product: true,
        user: true,
        quantity: true,
        refundUsedPointAmount: true,
      },
      populate: {
        product: {
          price: true,
          cashback_rate: true,
          delivery_fee: true,
        },
        users: { point: true },
      },
    })) as CancelCardOrderType
    const { pgCno, product, user, quantity, refundUsedPointAmount } = order
    // user point 초기화
    userPoint = user.point ?? 0
    // step 1 - 주문취소 상태로 변경
    await payload.update({
      collection: 'order',
      id: orderId,
      data: {
        orderStatus: 4,
      },
      req: { transactionID: dbTransactionID as string },
    })

    // step 2- 적립금 차감 계산
    if (product.cashback_rate > 0) {
      const refundAmount = Math.floor((product.cashback_rate * quantity * product.price) / 100)
      userPoint -= refundAmount

      await payload.create({
        collection: 'point-history',
        data: {
          // @ts-ignore
          user: Number(user.id),
          type: 'cancel',
          balanceAfter: userPoint,
          reason: `주문취소 - PG 주문번호 : ${pgCno}`,
        },
        req: { transactionID: dbTransactionID as string },
      })

      await payload.update({
        collection: 'users',
        id: Number(user.id),
        data: {
          point: userPoint,
        },
        req: { transactionID: dbTransactionID as string },
      })
    }

    // step 3 - 유저가 사용한 적립금 환불 계산
    if (refundUsedPointAmount > 0) {
      // 유저가 사용한 적립금
      // 적립금 환불 기록 추가
      userPoint +=  refundUsedPointAmount
      await payload.create({
        collection: 'point-history',
        data: {
          user: Number(user.id),
          type: 'cancel',
          balanceAfter: userPoint,
          reason: `유저 사용 적립금 환불 - PG 주문번호 : ${pgCno}`,
        },
        req: { transactionID: dbTransactionID as string },
      })

      // 유저 적립금 수정
      await payload.update({
        collection: 'users',
        id: Number(user.id),
        data: {
          point: userPoint,
        },
        req: { transactionID: dbTransactionID as string },
      })
    }

    // step 4 - 주문 취소 실행
    const amount = quantity * product.price + (product.delivery_fee ?? 0) - refundUsedPointAmount
    const shopTransactionId = generateRandomShopTransactionId()
    const authMsg = `${pgCno}|${shopTransactionId}`
    const hashedAuthMsg = crypto
      .createHmac('sha256', process.env.PAYMENTS_MSG_AUTH_VALUE as string)
      .update(authMsg)
      .digest('hex')

    if (amount > 0) {
      const paymentsCancelDto = {
        mallId: process.env.PAYMENTS_MID,
        shopTransactionId: shopTransactionId,
        pgCno: pgCno,
        reviseTypeCode: '32', // 32: 부분취소, 40: 전체취소
        amount: amount,
        cancelReqDate: moment.tz('Asia/Seoul').format('YYYYMMDD'),
        msgAuthValue: hashedAuthMsg,
      }
  
      const response = await fetch(process.env.PAYMENTS_CANCEL_URL as string, {
        method: 'POST',
        body: JSON.stringify(paymentsCancelDto),
        headers: {
          'Content-Type': 'application/json',
        },
      })
  
      if (!response.ok) {
        const errorData = await response.json()
        console.log(errorData)
        throw new Error('주문취소에 실패했습니다. 다시 시도해주세요.')
      }
  
      const result = await response.json()
      if (result.resCd !== '0000') {
        console.log(result)
        throw new Error('주문취소에 실패했습니다. 다시 시도해주세요.')
      }
    }

    await payload.db.commitTransaction(dbTransactionID as string)
    return { success: true, message: '주문취소가 완료되었습니다.', userPoint: userPoint }
  } catch (error) {
    await payload.db.rollbackTransaction(dbTransactionID as string)
    console.error(error)
    return { success: false, message: '주문취소에 실패했습니다.' }
  }
}

type CancelBankTransferProductType = {
  id: number
  price: number
  cashback_rate_for_bank: number
}

type CancelBankTransferUserType = {
  id: number
  point: number
}

type CancelBankTransferOrderType = {
  id: number
  product: CancelBankTransferProductType
  user: CancelBankTransferUserType
  quantity: number
  refundUsedPointAmount: number
}

export async function cancelOrderForBankTransfer({
  orderId,
  orderStatus,
}: {
  orderId: number
  orderStatus: number
}): Promise<{ success: boolean; message: string; userPoint?: number }> {
  const payload = await getPayload({ config: config })
  const dbTransactionID = await payload.db.beginTransaction()
  try {
    const order = (await payload.findByID({
      collection: 'order',
      id: orderId,
      select: {
        product: true,
        user: true,
        quantity: true,
        refundUsedPointAmount: true,
      },
      populate: {
        product: {
          price: true,
          cashback_rate_for_bank: true,
        },
        users: { point: true },
      },
    })) as CancelBankTransferOrderType
    const { product, user, quantity } = order
    let userPoint = user.point

    // step 1 - 주문취소 상태로 변경
    await payload.update({
      collection: 'order',
      id: orderId,
      data: {
        orderStatus: 4,
      },
      
      req: { transactionID: dbTransactionID as string },
    })

    // step 2 - 상품을 구매했을 때 적립된 적립금 차감 (상품준비단계에서서)
    if ((orderStatus === 1 || orderStatus === 2 || orderStatus === 3) && product.cashback_rate_for_bank > 0) {
      const refundAmount = Math.floor(
        (product.cashback_rate_for_bank * quantity * product.price) / 100,
      )
      userPoint -= refundAmount

      await payload.create({
        collection: 'point-history',
        data: {
          user: Number(user.id),
          type: 'cancel',
          balanceAfter: userPoint,
          reason: `주문취소 - 무통장 입금 주문번호 : ${order.id}`,
        },
        req: { transactionID: dbTransactionID as string },
      })

      await payload.update({
        collection: 'users',
        id: Number(user.id),
        data: {
          point: userPoint,
        },
        req: { transactionID: dbTransactionID as string },
      })
    }

    // step 3 - 유저가 사용한 적립금 환불 계산
    if (order.refundUsedPointAmount > 0) {
      // 유저가 사용한 적립금
      userPoint += order.refundUsedPointAmount
      // 적립금 환불 기록 추가
      await payload.create({
        collection: 'point-history',
        data: {
          user: Number(user.id),
          type: 'cancel',
          balanceAfter: userPoint,
          reason: `유저 사용 적립금 환불 - 무통장 입금 주문번호 : ${order.id}`,
        },
        req: { transactionID: dbTransactionID as string },
      })

      // 유저 적립금 수정
      await payload.update({
        collection: 'users',
        id: Number(user.id),
        data: {
          point: userPoint,
        },
        req: { transactionID: dbTransactionID as string },
      })
    }

    await payload.db.commitTransaction(dbTransactionID as string)
    return { success: true, message: '주문취소가 완료되었습니다.', userPoint: userPoint ?? 0 }
  } catch (error) {
    console.error(error)
    await payload.db.rollbackTransaction(dbTransactionID as string)
    return { success: false, message: '주문취소에 실패했습니다.' }
  }
}

export async function cancelOrderForBankTransferForHooks({
  orderId,
  orderStatus,
}: {
  orderId: number
  orderStatus: number
}): Promise<{ success: boolean; message: string; userPoint?: number }> {
  const payload = await getPayload({ config: config })

  try {
    const order = (await payload.findByID({
      collection: 'order',
      id: orderId,
      select: {
        product: true,
        user: true,
        quantity: true,
        refundUsedPointAmount: true,
      },
      populate: {
        product: {
          price: true,
          cashback_rate_for_bank: true,
        },
        users: { point: true },
      },
    })) as CancelBankTransferOrderType
    const { product, user, quantity } = order
    let userPoint = user.point

    // step 1 - 주문취소 상태로 변경 -> hooks에서 처리
    // await payload.update({
    //   collection: 'order',
    //   id: orderId,
    //   data: {
    //     orderStatus: 4,
    //   },
      
    //   req: { transactionID: dbTransactionID as string },
    // })

    // step 2 - 상품을 구매했을 때 적립된 적립금 차감 (상품준비단계에서서)
    if ((orderStatus === 1 || orderStatus === 2 || orderStatus === 3) && product.cashback_rate_for_bank > 0) {
      const refundAmount = Math.floor(
        (product.cashback_rate_for_bank * quantity * product.price) / 100,
      )
      userPoint -= refundAmount

      await payload.create({
        collection: 'point-history',
        data: {
          user: Number(user.id),
          type: 'cancel',
          balanceAfter: userPoint,
          reason: `주문취소 - 무통장 입금 주문번호 : ${order.id}`,
        },
      })

      await payload.update({
        collection: 'users',
        id: Number(user.id),
        data: {
          point: userPoint,
        },
      })
    }

    // step 3 - 유저가 사용한 적립금 환불 계산
    if (order.refundUsedPointAmount > 0) {
      // 유저가 사용한 적립금
      userPoint += order.refundUsedPointAmount
      // 적립금 환불 기록 추가
      await payload.create({
        collection: 'point-history',
        data: {
          user: Number(user.id),
          type: 'cancel',
          balanceAfter: userPoint,
          reason: `유저 사용 적립금 환불 - 무통장 입금 주문번호 : ${order.id}`,
        },
      })

      // 유저 적립금 수정
      await payload.update({
        collection: 'users',
        id: Number(user.id),
        data: {
          point: userPoint,
        },
      })
    }

    return { success: true, message: '주문취소가 완료되었습니다.', userPoint: userPoint ?? 0 }
  } catch (error) {
    console.error(error)
    return { success: false, message: '주문취소에 실패했습니다.' }
  }
}
