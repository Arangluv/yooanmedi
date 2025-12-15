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

  console.log('data.docs')
  console.log(data.docs)

  return data.docs
}
