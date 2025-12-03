'use server'

import { login as payloadLogin } from '@payloadcms/next/auth'
import config from '@/payload.config'
import { getPayload } from 'payload'

export async function login(id: string, password: string) {
  try {
    const payload = await getPayload({ config: config })

    const user = await payload.find({
      collection: 'users',
      select: {
        isApproved: true,
        role: true,
      },
      where: {
        username: {
          equals: id,
        },
      },
    })

    if (user.docs.length === 0) {
      return { success: false, message: '아이디 또는 비밀번호가 올바르지 않습니다' }
    }

    // 관리자면 로그인
    if (user.docs[0].role === 'admin') {
      await payloadLogin({
        config,
        collection: 'users',
        password,
        username: id,
      })

      return { success: true, message: '' }
    }

    if (!user.docs[0].isApproved) {
      return { success: false, message: '아직 회원가입이 승인되지 않았습니다' }
    }

    await payloadLogin({
      config,
      collection: 'users',
      password,
      username: id,
    })

    return { success: true, message: '' }
  } catch (error: any) {
    if (error.message === '아직 회원가입이 승인되지 않았습니다') {
      throw error
    } else {
      throw new Error('아이디 또는 비밀번호가 올바르지 않습니다')
    }
  }
}
