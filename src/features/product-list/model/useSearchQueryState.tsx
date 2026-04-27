'use client';

import { parseAsString, parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs';
import { SEARCH_FIELD_KEY, type SearchFieldKey } from '../constant/search-field';

// todo :: 이 부분과 서버에서 사용하는 filter는 반드시 동기화되어야 하는데 어떤식으로 구조를 잡을 수 있을까?
const targetFilters = {
  keyword: parseAsString.withDefault(''),
  condition: parseAsStringLiteral(SEARCH_FIELD_KEY).withDefault(SEARCH_FIELD_KEY[0]),
  page: parseAsInteger.withDefault(1),
  category: parseAsInteger,
  opt: parseAsStringLiteral(['favorites']),
};

export const useSearchQueryState = () => {
  const [filters, setFilters] = useQueryStates(targetFilters, {
    shallow: false,
    history: 'push',
    limitUrlUpdates: {
      method: 'debounce',
      timeMs: 500,
    },
  });

  const updateKeyword = ({
    keyword,
    condition,
  }: {
    keyword: string;
    condition: SearchFieldKey;
  }) => {
    setFilters({
      condition,
      keyword,
      opt: null,
      category: null,
      page: 1,
    });
  };

  const updateCategory = (category: number | null) => {
    setFilters({
      page: 1,
      category,
      opt: null,
    });
  };

  const updatePage = (page: number) => {
    setFilters({
      page,
    });
  };

  const updateFavorites = () => {
    setFilters({
      keyword: '',
      condition: SEARCH_FIELD_KEY[0],
      page: 1,
      category: null,
      opt: 'favorites',
    });
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      condition: SEARCH_FIELD_KEY[0],
      page: 1,
      category: null,
    });
  };

  return {
    filters,
    updateKeyword,
    updateCategory,
    updatePage,
    updateFavorites,
    resetFilters,
  };
};
