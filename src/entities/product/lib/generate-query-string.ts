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

  return queryString.toString() as unknown;
};
