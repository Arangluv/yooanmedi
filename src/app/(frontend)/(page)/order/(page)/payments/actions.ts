'use server'

// 결제주문 등록 API -> 임시 테스트
// POST 요청
export async function registerOrder(orderInfo: any) {
  try {
    const dto = {
      mallId: process.env.PAYMENTS_MID,
      ...orderInfo,
    }

    const res = await fetch(process.env.PAYMENTS_REGISTER_URL as string, {
      method: 'POST',
      body: JSON.stringify(dto),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!res.ok) {
      const errorData = await res.json()
      console.log('결제주문 등록시 에러가 발생')
      console.log(errorData)
      return null
    }
    const data = await res.json()
    return data
  } catch (error) {
    return null
  }
}
