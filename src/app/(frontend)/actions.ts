'use server'

export async function login(email: string, password: string) {
  try {
    const res = await fetch(process.env.SITE_URL + '/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      throw new Error('로그인 실패')
    }

    return
  } catch (error) {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다')
  }
}
