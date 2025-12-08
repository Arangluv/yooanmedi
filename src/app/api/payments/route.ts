import { NextRequest, NextResponse } from 'next/server'

type PaymentResponseType = {
  resCd: string
  authorizationId: string
  shopOrderNo: string
  shopValue1: string
  shopValue2: string
  shopValue3?: string
  shopValue4?: string
  shopValue5?: string
  shopValue6?: string
}

export async function POST(request: NextRequest) {
  try {
    let data = {} as PaymentResponseType
    const formData = await request.formData()
    formData.forEach((value: any, key: string) => {
      // @ts-ignore
      data[key as unknown as string] = value
    })
    // {
    //   shopValue2: '[{"id":1,"quantity":10},{"id":10,"quantity":100},{"id":12,"quantity":123},{"id":7,"quantity":14},{"id":6,"quantity":16},{"id":21,"quantity":15},{"id":134,"quantity":15},{"id":14,"quantity":154},{"id":484,"quantity":3},{"id":645,"quantity":1123},{"id":123,"quantity":1123}]',
    //   resCd: '0000',
    //   authorizationId: '25120721541810002700',
    //   shopValue1: '이건 배송요청사항이에요 잘 부탁드려요',
    //   shopValue4: '',
    //   shopValue3: '',
    //   shopValue6: '',
    //   shopValue5: '',
    //   resMsg: '정상',
    //   shopOrderNo: '202512072006367'
    // }

    if (data.resCd === '0000') {
      const { authorizationId, shopOrderNo, shopValue1, shopValue2, shopValue3 } = data
      const userOrderRequest = shopValue1 as string
      const orderList = JSON.parse(shopValue2 as string)
      const usedPoint = shopValue3 as string

      console.log('userOrderRequest')
      console.log(userOrderRequest)
      console.log('orderList')
      console.log(orderList)
      console.log('usedPoint')
      console.log(usedPoint)

      // 리다이렉트
      const url = request.nextUrl.clone()
      url.pathname = '/order/payments/result'
      url.searchParams.set('status', 'success')
      return NextResponse.redirect(url, { status: 302 })
    } else {
      console.log('코드가 000이 아님 그때의 data?')
      console.log(data)
      throw new Error('결제 실패', { cause: { code: data.resCd } })
    }
  } catch (error: any) {
    console.error('결제 콜백 처리 에러:')
    console.error(error.cause)

    const url = request.nextUrl.clone()
    url.pathname = '/order/payments/result'
    url.searchParams.set('status', 'error')
    url.searchParams.set('code', error.cause.code)

    return NextResponse.redirect(url, { status: 302 })
  }
}
