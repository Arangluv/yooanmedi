export const KEYWORD_SEARCH_CONDITION_KEY = ['pn', 'cn'] as const;
// readonly ['pn', 'cn']
export type KeywordSearchConditionKey = (typeof KEYWORD_SEARCH_CONDITION_KEY)[number];

export const KEYWORD_SEARCH_CONDITION_LABEL: Record<KeywordSearchConditionKey, string> = {
  pn: '상품명',
  cn: '제약사명',
};
