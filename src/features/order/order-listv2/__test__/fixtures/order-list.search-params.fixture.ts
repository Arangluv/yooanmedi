import { SearchParams } from 'nuqs';

export const OrderListSearchParamsFixtures = {
  admin: {
    default: Promise.resolve({} satisfies SearchParams),
    withQuries: Promise.resolve({ page: '3', orderStatus: 'pending' } satisfies SearchParams),
    invalidParams: Promise.resolve({
      page: 'not number',
      orderStatus: 'invalid-status',
    } satisfies SearchParams),
  },
  client: {
    default: Promise.resolve({} satisfies SearchParams),
    withQuries: Promise.resolve({
      from: '20260501',
      to: '20260606',
      keyword: '테스트상품',
      orderStatus: 'preparing',
    } satisfies SearchParams),
    invalidParams: Promise.resolve({
      from: 'invalid',
      to: 'invalid',
      keyword: '',
      orderStatus: 'invalid',
    } satisfies SearchParams),
  },
};
