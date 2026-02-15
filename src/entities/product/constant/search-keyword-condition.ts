export const KEYWORD_SEARCH_CONDITION = {
  PRODUCT_NAME: 'pn',
  MANUFACTURER_NAME: 'cn',
  INGREDIENT_NAME: 'in',
} as const;

export const KEYWORD_SEARCH_CONDITION_KEY = ['pn', 'cn', 'in'] as const;

export type KeywordSearchConditionKey = (typeof KEYWORD_SEARCH_CONDITION_KEY)[number];

export const KEYWORD_SEARCH_CONDITION_LABEL: Record<KeywordSearchConditionKey, string> = {
  pn: '상품명',
  cn: '제약사명',
  in: '성분명',
};
