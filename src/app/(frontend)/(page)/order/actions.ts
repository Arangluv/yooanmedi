'use server'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { cookies } from 'next/headers'

export async function getAuthUser() {
  const payload = await getPayload({ config: config })
  const { user } = await payload.auth({
    headers: new Headers({ cookie: (await cookies()).toString() }),
  })
  // 로그인하지 않았다면 user === null;
  if (!user) {
    return {
      user: null,
      message: '로그인 후 이용할 수 있습니다',
    }
  }

  const { role, isApproved, username } = user

  // 관리자면 로그인
  if (role === 'admin') {
    return {
      user: { role, isApproved, username },
      message: 'success',
    }
  }

  // 회원가입 승인여부 검사
  if (!isApproved) {
    return {
      user: null,
      message: '아직 회원가입이 승인되지 않았습니다',
    }
  }

  return {
    user: { role, isApproved, username },
    message: 'success',
  }
}
