'use client';

import { parseAsString, parseAsInteger, parseAsStringLiteral, useQueryStates } from 'nuqs';

import {
  KEYWORD_SEARCH_CONDITION_KEY,
  KeywordSearchConditionKey,
} from '../constant/search-keyword-condition';

// 이 부분과 서버에서 사용하는 filter는 반드시 동기화되어야 하는데 어떤식으로 구조를 잡을 수 있을까?
const targetFilters = {
  keyword: parseAsString.withDefault(''),
  condition: parseAsStringLiteral(KEYWORD_SEARCH_CONDITION_KEY).withDefault(
    KEYWORD_SEARCH_CONDITION_KEY[0],
  ),
  page: parseAsInteger.withDefault(1),
  category: parseAsInteger,
};

const useSearchQueryState = () => {
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
    condition: KeywordSearchConditionKey;
  }) => {
    setFilters({
      condition,
      keyword,
      page: 1,
    });
  };

  const updateCategory = (category: number | null) => {
    setFilters({
      page: 1,
      category,
    });
  };

  const updatePage = (page: number) => {
    setFilters({
      page,
    });
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      condition: KEYWORD_SEARCH_CONDITION_KEY[0],
      page: 1,
      category: null,
    });
  };

  return {
    filters,
    updateKeyword,
    updateCategory,
    updatePage,
    resetFilters,
  };
};

export default useSearchQueryState;
