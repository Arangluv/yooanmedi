'use server'

import { login as payloadLogin } from '@payloadcms/next/auth'
import config from '@/payload.config'

export async function login(id: string, password: string) {
  try {
    const result = await payloadLogin({
      config,
      collection: 'users',
      password,
      username: id,
    })

    return result
  } catch (error) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다')
  }
}
