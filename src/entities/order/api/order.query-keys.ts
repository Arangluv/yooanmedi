export const ORDER_QUERY_KEYS = {
  all: () => ['order'] as const,
  list: (params: any) => ['order', 'order-list', params] as const,
  detail: (id: number) => ['order', 'order-detail', id] as const,
};
