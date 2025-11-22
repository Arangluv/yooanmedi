'use server'

import { getPayload } from 'payload'
import config from '@payload-config'

export async function login(id: string, password: string) {
  const payload = await getPayload({ config: config })

  const user = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: id,
      },
    },
  })
}
