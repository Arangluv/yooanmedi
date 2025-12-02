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

export async function findIdToResetPassword(dto: {
  username: string
  hospitalName: string
  nursingNumber: string
}) {
  try {
    const payload = await getPayload({ config: config })
    const { username, hospitalName, nursingNumber } = dto
    const user = await payload.find({
      collection: 'users',
      select: {
        username: true,
      },
      where: {
        username: {
          equals: username,
        },
        hospitalName: {
          equals: hospitalName,
        },

        nursingNumber: {
          equals: nursingNumber,
        },
      },
    })
    const userData = user.docs
    if (userData.length === 0) {
      throw new Error('아이디가 존재하지 않습니다')
    }

    return userData[0].username
  } catch (error) {
    throw error
  }
}

export async function resetPassword(dto: { username: string; password: string }) {
  try {
    const payload = await getPayload({ config: config })
    const { username, password } = dto
    const user = await payload.update({
      collection: 'users',
      data: {
        password: password,
      },
      where: {
        username: {
          equals: username,
        },
      },
    })

    return user
  } catch (error) {
    throw error
  }
}
