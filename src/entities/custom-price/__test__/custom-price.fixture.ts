const baseCustomPriceFixture = {
  id: 1,
  product: {
    id: 3,
  },
  price: 3000,
};

export const createCustomPriceFixture = (overide?: Partial<typeof baseCustomPriceFixture>) => {
  return {
    ...baseCustomPriceFixture,
    ...overide,
  };
};

export const invalidCases = [
  {
    caseName: 'id가 비어있는 경우',
    data: [createCustomPriceFixture({ id: undefined })],
  },
  {
    caseName: 'price가 음수인 경우',
    data: [createCustomPriceFixture({ price: -3000 })],
  },
  {
    caseName: '상품이 비어있는 경우',
    data: [createCustomPriceFixture({ product: undefined })],
  },
];
