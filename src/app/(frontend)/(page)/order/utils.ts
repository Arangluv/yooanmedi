import { SearchParamsType } from '@/app/(frontend)/(page)/order/_type';
import { v4 as uuidv4 } from 'uuid';

export const formatNumberWithCommas = (number: number) => {
  if (!number) return '0';

  return number.toLocaleString('ko-KR');
};

export const generateQueryString = (params: { [key: string]: any }) => {
  const { searchParams } = params;
  const queryString = new URLSearchParams(searchParams);

  if (params.keyword) {
    // 검색한 경우 -> SearchForm에서 호출한 경우
    queryString.set('keyword', params.keyword);
  } else {
    // 다른 컴포넌트에서 호출한 경우
    if (searchParams.get('keyword')) {
      // 기존에 검색어가 있다면 그대로 유지
      queryString.set('keyword', searchParams.get('keyword'));
    } else {
      queryString.delete('keyword');
    }
  }

  if (params.condition) {
    queryString.set('condition', params.condition);
  } else {
    if (searchParams.get('condition')) {
      queryString.set('condition', searchParams.get('condition'));
    } else {
      queryString.delete('condition');
    }
  }

  if (params.page) {
    queryString.set('page', params.page);
  } else {
    if (searchParams.get('page')) {
      queryString.set('page', searchParams.get('page'));
    } else {
      queryString.delete('page');
    }
  }

  if (params.category) {
    if (params.category === 'all') {
      queryString.delete('category');
    } else {
      queryString.set('category', params.category);
    }
  } else {
    if (searchParams.get('category')) {
      queryString.set('category', searchParams.get('category'));
    } else {
      queryString.delete('category');
    }
  }

  return queryString.toString() as unknown as SearchParamsType;
};

export const generateQueryStringForSearch = (params: { [key: string]: any }) => {
  const { searchParams } = params;
  const queryString = new URLSearchParams(searchParams);

  if (params.keyword) {
    // 검색한 경우 -> SearchForm에서 호출한 경우
    queryString.set('keyword', params.keyword);
    queryString.set('condition', params.condition);
    queryString.set('page', '1');
  } else {
    queryString.delete('keyword');
    queryString.delete('condition');
  }

  return queryString.toString() as unknown as SearchParamsType;
};

export const getPointOnPurchase = (price: number, cashback_rate: number) => {
  // 10원 단위로 내림
  const calculatedPoint = price * (cashback_rate / 100);
  const point = Math.floor(calculatedPoint);

  return formatNumberWithCommas(point);
};

export const getMaxPointOnPurchase = ({
  price,
  cashback_rate,
  cashback_rate_for_bank,
}: {
  price: number;
  cashback_rate: number;
  cashback_rate_for_bank: number;
}) => {
  const cardPoint = Math.floor(price * (cashback_rate / 100));
  const bankPoint = Math.floor(price * (cashback_rate_for_bank / 100));

  return formatNumberWithCommas(Math.max(cardPoint, bankPoint));
};

export const generateGetProductCondition = (params: { [key: string]: any }) => {
  const condition = params.condition ? params.condition : null;
  const keyword = params.keyword ? params.keyword : null;
  const category = params.category ? params.category : null;

  let searchCondition = null;

  if (condition === 'pn') {
    searchCondition = {
      name: {
        contains: keyword,
      },
    };
  } else if (condition === 'cn') {
    searchCondition = {
      manufacturer: {
        contains: keyword,
      },
    };
  } else {
    searchCondition = null;
  }

  const conditionObject = {
    where: {
      ...(searchCondition ? searchCondition : {}),
      ...(category ? { category: { equals: category } } : {}),
      stock: {
        greater_than: 0,
      },
    } as const,
  };

  return conditionObject;
};

export const generateRandomShopTransactionId = () => {
  const uuid = uuidv4();

  return uuid.split('-').join('').toUpperCase();
};
