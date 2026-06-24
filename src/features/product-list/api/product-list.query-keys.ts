export const PRODUCT_LIST_QUERY_KEYS = {
  all: () => ['product-list'] as const,
  ranking: () => ['product-list', 'ranking'] as const,
  list: (params: any) => ['product-list', params] as const,
};
