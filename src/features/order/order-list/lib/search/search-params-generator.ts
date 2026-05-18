import { ServerSearchParamsAdapter } from '@/shared/infrastructure';
import { OrderListSearchParamsParser } from './search-params-parser';
import { SearchParams } from 'nuqs';

export const OrderListSearchParamsGenerator = {
  getClientSafeSearchParams: (searchParams: Promise<SearchParams>) => {
    const parserMap = OrderListSearchParamsParser.getClientParserMap();
    const searchParamsAdapter = new ServerSearchParamsAdapter(parserMap);
    return searchParamsAdapter.getSafeSearchParam(searchParams);
  },
  getAdminSafeSearchParams: (searchParams: Promise<SearchParams>) => {
    const parserMap = OrderListSearchParamsParser.getAdminParserMap();
    const searchParamsAdapter = new ServerSearchParamsAdapter(parserMap);
    return searchParamsAdapter.getSafeSearchParam(searchParams);
  },
};
