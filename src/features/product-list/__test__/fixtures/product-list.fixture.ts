import { SearchParams } from 'nuqs';
import { ProductListServerSearchParams } from '../../infrastructure';

export const ProductListRequestDtoFixture = {
  default: Promise.resolve({} satisfies SearchParams),

  withCategory: Promise.resolve({
    keyword: '',
    condition: 'pn',
    page: '1',
    category: '3',
  } satisfies SearchParams),

  withOption: Promise.resolve({
    opt: ['favorites'],
  } satisfies SearchParams),

  invalid: Promise.resolve({ name: 'test', opt: 'invalid-option' } satisfies SearchParams),
};

export const ProductListSearchParamsFixtures = {
  default: {
    keyword: '',
    condition: 'pn',
    page: 1,
    category: null,
    opt: null,
  } as ProductListServerSearchParams,

  withCategory: {
    keyword: '테스트 키워드',
    condition: 'pn',
    page: 1,
    category: 1,
    opt: null,
  } as ProductListServerSearchParams,
};
