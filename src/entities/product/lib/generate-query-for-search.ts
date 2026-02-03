import type { SearchParamsType } from '../model/types';

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
