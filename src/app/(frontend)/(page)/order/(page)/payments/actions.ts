'use server'

// 결제주문 등록 API -> 임시 테스트
// POST 요청
export async function registerOrder(orderInfo: any) {
  try {
    const TEST_URL = 'https://testpgapi.easypay.co.kr/api/ep9/trades/webpay'

    const res = await fetch(TEST_URL, {
      method: 'POST',
      body: JSON.stringify(orderInfo),
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
    console.log('결제주문 등록 성공')
    console.log(data)
    return data
  } catch (error) {
    return null
  }
}
