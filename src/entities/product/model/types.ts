import type { KeywordSearchConditionKey } from '../constant/search-keyword-condition';

export type SearchParamsType = {
  condition: KeywordSearchConditionKey | null | undefined;
  keyword: string | undefined;
  page: string | undefined;
  category: string | undefined;
};
