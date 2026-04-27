export const SEARCH_FIELD = {
  productName: 'pn',
  manufacturerName: 'cn',
  ingredientName: 'in',
} as const;

export const SEARCH_FIELD_KEY = ['pn', 'cn', 'in'] as const;
export type SearchFieldKey = (typeof SEARCH_FIELD_KEY)[number];

export const SEARCH_FIELD_LABEL: Record<SearchFieldKey, string> = {
  pn: '상품명',
  cn: '제약사명',
  in: '성분명',
};
