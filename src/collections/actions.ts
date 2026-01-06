'use server'

import config from '@/payload.config'
import { getPayload } from 'payload'

type RegisterProductDto = {
  name: string
  insurance_code: string
  manufacturer: string
  specification: string
  price: number
}

export async function registerProduct(dto: RegisterProductDto[]) {
  const payload = await getPayload({ config: config })
  const products = Promise.all(
    dto.map(async (item) => {
      const product = await payload.create({
        collection: 'product',
        data: {
          ...item,
          cashback_rate: 0,
          cashback_rate_for_bank: 0,
          stock: 999,
          delivery_fee: 0,
          returnable: false,
          is_best_product: false,
          category: null,
        },
      })
      return product
    }),
  )

  return products
}
