'use server'

import { getPayload } from 'payload'
import config from '@/payload.config'
import moment from 'moment'

export async function getOrderList({
  userId,
  start,
  end,
}: {
  userId: string
  start: string
  end: string
}) {
  const payload = await getPayload({ config: config })
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
    where: {
      user: {
        equals: userId,
      },
      orderCreatedAt: {
        greater_than_equal: new Date(start).toISOString(),
        less_than_equal: moment(end).endOf('day').toISOString(),
      },
    },
  })

  return data.docs
}
