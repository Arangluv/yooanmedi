const baseShoppingCartItem = {
  id: 1,
  user: 3,
  product: 1321,
  quantity: 3,
};

export const createShoppingCartItemFixture = (override?: Partial<typeof baseShoppingCartItem>) => {
  return {
    ...baseShoppingCartItem,
    ...override,
  };
};
