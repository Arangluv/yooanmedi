import { SearchParamsType } from '@order/_type'

export const formatNumberWithCommas = (number: number) => {
  if (!number) return '0'

  return number.toLocaleString('ko-KR')
}

export const generateQueryString = (params: { [key: string]: any }) => {
  const { searchParams } = params
  const queryString = new URLSearchParams(searchParams)

  if (params.keyword) {
    // 검색한 경우 -> SearchForm에서 호출한 경우
    queryString.set('keyword', params.keyword)
  } else {
    // 다른 컴포넌트에서 호출한 경우
    if (searchParams.get('keyword')) {
      // 기존에 검색어가 있다면 그대로 유지
      queryString.set('keyword', searchParams.get('keyword'))
    } else {
      queryString.delete('keyword')
    }
  }

  if (params.condition) {
    queryString.set('condition', params.condition)
  } else {
    if (searchParams.get('condition')) {
      queryString.set('condition', searchParams.get('condition'))
    } else {
      queryString.delete('condition')
    }
  }

  if (params.page) {
    queryString.set('page', params.page)
  } else {
    if (searchParams.get('page')) {
      queryString.set('page', searchParams.get('page'))
    } else {
      queryString.delete('page')
    }
  }

  if (params.category) {
    if (params.category === 'all') {
      queryString.delete('category')
    } else {
      queryString.set('category', params.category)
    }
  } else {
    if (searchParams.get('category')) {
      queryString.set('category', searchParams.get('category'))
    } else {
      queryString.delete('category')
    }
  }

  return queryString.toString() as unknown as SearchParamsType
}

export const generateQueryStringForSearch = (params: { [key: string]: any }) => {
  const { searchParams } = params
  const queryString = new URLSearchParams(searchParams)

  if (params.keyword) {
    // 검색한 경우 -> SearchForm에서 호출한 경우
    queryString.set('keyword', params.keyword)
    queryString.set('condition', params.condition)
    queryString.set('page', '1')
  } else {
    queryString.delete('keyword')
    queryString.delete('condition')
  }

  return queryString.toString() as unknown as SearchParamsType
}

export const getPointOnPurchase = (price: number, cashback_rate: number) => {
  // 10원 단위로 내림
  const point = Math.floor(price * (cashback_rate / 100)) * 10

  return formatNumberWithCommas(point)
}

export const generateGetProductCondition = (params: { [key: string]: any }) => {
  const condition = params.condition ? params.condition : null
  const keyword = params.keyword ? params.keyword : null
  const category = params.category ? params.category : null

  let searchCondition = null

  if (condition === 'pn') {
    searchCondition = {
      name: {
        contains: keyword,
      },
    }
  } else if (condition === 'cn') {
    searchCondition = {
      manufacturer: {
        contains: keyword,
      },
    }
  } else {
    searchCondition = null
  }

  const conditionObject = {
    where: {
      ...(searchCondition ? searchCondition : {}),
      ...(category ? { category: { equals: category } } : {}),
    } as const,
  }

  return conditionObject
}
