export const PRODUCT_LIST_SEARCH_FIELD = {
  productName: 'pn',
  manufacturerName: 'cn',
  ingredientName: 'in',
} as const;

export const PRODUCT_LIST_SEARCH_FIELD_KEY = ['pn', 'cn', 'in'] as const;
export type ProductListSearchFieldKey = (typeof PRODUCT_LIST_SEARCH_FIELD_KEY)[number];

export const PRODUCT_LIST_SEARCH_FIELD_LABEL: Record<ProductListSearchFieldKey, string> = {
  pn: '상품명',
  cn: '제약사명',
  in: '성분명',
};
