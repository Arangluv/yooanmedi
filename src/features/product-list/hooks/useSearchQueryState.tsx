'use client';

import { useQueryStates } from 'nuqs';
import { PRODUCT_LIST_SEARCH_FIELD_KEY, PRODUCT_LIST_SEARCH_FIELD } from '../constants';
import { productListParserMap } from '../core';

type ProductListSearchFieldKey = (typeof PRODUCT_LIST_SEARCH_FIELD_KEY)[number];

export const useSearchQueryState = () => {
  const [filters, setFilters] = useQueryStates(productListParserMap, {
    shallow: false,
    history: 'push',
    limitUrlUpdates: {
      method: 'debounce',
      timeMs: 500,
    },
  });

  const DEFAULT_SEARCH_FIELD = PRODUCT_LIST_SEARCH_FIELD.productName;

  const updateKeyword = ({
    keyword,
    condition,
  }: {
    keyword: string;
    condition: ProductListSearchFieldKey;
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
      condition: DEFAULT_SEARCH_FIELD,
      page: 1,
      category: null,
      opt: 'favorites',
    });
  };

  const resetFilters = () => {
    setFilters({
      keyword: '',
      condition: DEFAULT_SEARCH_FIELD,
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
