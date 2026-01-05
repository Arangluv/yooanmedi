import OrderListExportButton from './OrderListExportButton'

export default async function OrderListExport(props: any) {
  const payload = props.payload
  const searchParams = props.searchParams
  const where = parseSearchParamsToWhere(searchParams)

  const data = await payload.find({
    collection: 'order',
    limit: 0,
    where: where,
    select: {
      user: true,
      product: true,
      orderCreatedAt: true,
      paymentsMethod: true,
      quantity: true,
      orderStatus: true,
      orderRequest: true,
    },
    populate: {
      users: {
        hospitalName: true,
      },
      product: {
        name: true,
        price: true,
        insurance_code: true,
        specification: true,
      },
    },
  })

  return (
    <div>
      <OrderListExportButton data={data.docs}></OrderListExportButton>
    </div>
  )
}

// searchParams를 Payload where 절로 변환하는 함수
function parseSearchParamsToWhere(searchParams: Record<string, string>): any {
  const whereConditions: any[] = []

  // where로 시작하는 키만 필터링
  const whereKeys = Object.keys(searchParams).filter((key) => key.startsWith('where'))

  if (whereKeys.length === 0) {
    return undefined
  }

  // where[or][0][and][0][user][equals] 형태를 파싱
  whereKeys.forEach((key) => {
    // where[or][인덱스][and][인덱스][필드명][연산자] 형태 파싱
    const match = key.match(/^where\[or\]\[(\d+)\]\[and\]\[(\d+)\]\[([^\]]+)\]\[([^\]]+)\]$/)

    if (match) {
      const [, orIndex, andIndex, fieldName, operator] = match
      const value = searchParams[key]

      // 조건 객체 생성
      const condition: any = {}
      condition[fieldName] = {
        [operator]: value,
      }

      // 이미 같은 필드의 조건이 있는지 확인하고 추가
      // AND 조건으로 묶기 위해 모든 조건을 배열에 추가
      whereConditions.push(condition)
    }
  })

  // AND 조건으로 묶어서 반환
  return whereConditions.length > 0 ? { and: whereConditions } : undefined
}
