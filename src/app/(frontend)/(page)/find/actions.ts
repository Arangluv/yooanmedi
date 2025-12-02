'use server'

import config from '@/payload.config'
import { getPayload } from 'payload'

export async function findId(dto: {
  hospitalName: string
  businessNumber: string
  nursingNumber: string
  phoneNumber: string
}) {
  try {
    const payload = await getPayload({ config: config })
    const { hospitalName, businessNumber, nursingNumber, phoneNumber } = dto
    const user = await payload.find({
      collection: 'users',
      select: {
        username: true,
      },
      where: {
        hospitalName: {
          equals: hospitalName,
        },
        businessNumber: {
          equals: businessNumber,
        },
        nursingNumber: {
          equals: nursingNumber,
        },
        phoneNumber: {
          equals: phoneNumber,
        },
      },
    })
    const userData = user.docs
    if (userData.length === 0) {
      throw new Error('가입 이력이 없는 아이디입니다')
    }

    return userData[0].username
  } catch (error) {
    throw error
  }
}
