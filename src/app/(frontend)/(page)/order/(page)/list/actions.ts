'use server'

import { getPayload, Where } from 'payload'
import config from '@/payload.config'
import moment from 'moment'

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
  const endDate = moment(end).endOf('day').toISOString()

  let productIds: string[] | undefined
  if (productName && productName.trim() !== '') {
    const products = await payload.find({
      collection: 'product',
      where: {
        name: {
          contains: productName,
        },
      },
      limit: 1000, // 충분히 큰 값으로 설정
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
    where: where,
  })

  return data.docs
}

export async function cancelOrder({ orderId }: { orderId: number }) {
  const payload = await getPayload({ config: config })
  const dbTransactionID = await payload.db.beginTransaction()
  try {
    const order = await payload.findByID({
      collection: 'order',
      id: orderId,
      select: {
        pgCno: true,
        product: true,
        user: true,
        quantity: true,
      },
      populate: {
        product: {
          price: true,
          cashback_rate: true,
        },
        users: { point: true },
      },
    })
    const { pgCno, product, user, quantity } = order
    // step 1 - 주문취소 상태로 변경
    await payload.update({
      collection: 'order',
      id: orderId,
      data: {
        orderStatus: 4,
      },
    })

    // step 2- 적립금 차감 계산
    // @ts-ignore
    if (product.cashback_rate > 0) {
      // @ts-ignore
      const refundAmount = Math.floor((product.cashback_rate * quantity * product.price) / 100)
      // @ts-ignore
      const userPoint = user.point ?? 0
      const afterTotalPoint = userPoint + refundAmount

      await payload.create({
        collection: 'point-history',
        data: {
          // @ts-ignore
          user: Number(user.id),
          type: 'cancel',
          balanceAfter: afterTotalPoint,
          reason: `주문취소 - PG 주문번호 : ${pgCno}`,
        },
      })

      await payload.update({
        collection: 'users',
        // @ts-ignore
        id: Number(user.id),
        data: {
          point: afterTotalPoint,
        },
      })
    }

    // step 3 - 유저가 사용한 적립금 환불 계산
    const { docs: pointForTransationList } = await payload.find({
      collection: 'point-for-transation',
      where: {
        transactionPgCno: {
          equals: pgCno,
        },
      },
    })

    if (pointForTransationList.length > 0 && pointForTransationList[0].usedPointAmount > 0) {
      // user point 변경
      await payload.update({
        collection: 'users',
        // @ts-ignore
        id: Number(user.id),
        data: {
          // @ts-ignore
          point: user.point + pointForTransationList[0].usedPointAmount,
        },
      })

      await payload.create({
        collection: 'point-history',
        data: {
          // @ts-ignore
          user: Number(user.id),
          type: 'cancel',
          // @ts-ignore
          balanceAfter: user.point + pointForTransationList[0].usedPointAmount,
          reason: `유저 사용 적립금 환불 - PG 주문번호 : ${pgCno}`,
        },
      })

      // 사용한 적립금을 0으로 변경
      await payload.update({
        collection: 'point-for-transation',
        id: pointForTransationList[0].id,
        data: {
          usedPointAmount: 0,
        },
      })
    }

    // step 4 - 주문 취소 실행

    
    await payload.db.commitTransaction(dbTransactionID as string)
  } catch (error) {
    await payload.db.rollbackTransaction(dbTransactionID as string)
    console.error(error)
    throw new Error('주문취소에 실패했습니다.')
  }

  return null
}
