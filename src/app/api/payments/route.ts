import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'

export async function POST(request: NextRequest) {
  try {
    console.log('여기가 실행되는가#1')
    console.log('결제완료 후 콜백 파라미터 (request)')
    console.log(request)
    let data = {}
    const formData = await request.formData()
    formData.forEach((value: any, key: string) => {
      // @ts-ignore
      data[key as unknown as string] = value
    })

    console.log('data')
    console.log(data)
    // {
    //   shopValue2: '',
    //   resCd: '0000',
    //   authorizationId: '25120721541810002700',
    //   shopValue1: '',
    //   shopValue4: '',
    //   shopValue3: '',
    //   shopValue6: '',
    //   shopValue5: '',
    //   resMsg: '정상',
    //   shopOrderNo: '202512072006367'
    // }

    const url = request.nextUrl.clone()
    url.pathname = '/order/payments/result'
    url.searchParams.set('status', 'success')

    return NextResponse.redirect(url, { status: 302 })
  } catch (error: any) {
    console.error('결제 콜백 처리 에러:')
    console.error(error)
    const url = request.nextUrl.clone()
    url.pathname = '/order/payments/result'
    url.searchParams.set('status', 'error')

    return NextResponse.redirect(url, { status: 302 })
  }
}
