export const CART_QUERY_KEYS = {
  all: () => ['cart'] as const,
  detail: (id: number) => ['cart', 'cart-detail', id] as const,
};
