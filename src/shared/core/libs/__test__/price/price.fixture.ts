import { PriceItemDto } from '../../price';

export const PriceItemDtoFixtures = {
  valid: {
    basic: {
      id: 1,
      product: {
        price: 10000,
        delivery_fee: 3000,
        is_cost_per_unit: false,
        is_free_delivery: false,
      },
      quantity: 3,
    } as PriceItemDto,

    costPerUnit: {
      id: 2,
      product: {
        price: 10000,
        delivery_fee: 3000,
        is_cost_per_unit: true,
        is_free_delivery: false,
      },
      quantity: 3,
    } as PriceItemDto,

    freeDelivery: {
      id: 3,
      product: {
        price: 10000,
        delivery_fee: 3000,
        is_cost_per_unit: false,
        is_free_delivery: true,
      },
      quantity: 3,
    } as PriceItemDto,
  },

  invalid: {
    invalidData: {
      name: 'asd',
    } as any,

    negativeQuantity: {
      id: 1,
      product: {
        price: 10000,
        delivery_fee: 3000,
        is_cost_per_unit: false,
        is_free_delivery: true,
      },
      quantity: -3,
    } as PriceItemDto,

    negativePrice: {
      id: 2,
      product: {
        price: -100,
        delivery_fee: 3000,
        is_cost_per_unit: false,
        is_free_delivery: true,
      },
      quantity: 10,
    } as PriceItemDto,

    zeroQuantity: {
      id: 3,
      product: {
        price: 10000,
        delivery_fee: 3000,
        is_cost_per_unit: false,
        is_free_delivery: true,
      },
      quantity: 0,
    } as PriceItemDto,
  },
};

export const createPriceItemDto = (override?: Partial<PriceItemDto>) => {
  return {
    ...PriceItemDtoFixtures.valid.basic,
    ...override,
  };
};
