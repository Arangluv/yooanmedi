'use server'

import { login as payloadLogin } from '@payloadcms/next/auth'
import config from '@/payload.config'
import { getPayload } from 'payload'

export async function login(id: string, password: string) {
  try {
    const payload = await getPayload({ config: config })

    const user = await payload.find({
      collection: 'users',
      where: {
        username: {
          equals: id,
        },
        isApproved: {
          equals: true,
        },
      },
    })

    if (user.docs.length === 0) {
      throw new Error('아직 회원가입이 승인되지 않았습니다')
    }

    await payloadLogin({
      config,
      collection: 'users',
      password,
      username: id,
    })

    return
  } catch (error: any) {
    if (error.message === '아직 회원가입이 승인되지 않았습니다') {
      throw error
    } else {
      throw new Error('아이디 또는 비밀번호가 올바르지 않습니다')
    }
  }
}
