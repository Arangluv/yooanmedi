import { parseAsStringLiteral, inferParserType, SearchParams } from 'nuqs/server';
import { ServerSearchParamsAdapter } from '@/shared/server';

const termsParserMap = {
  type: parseAsStringLiteral(['terms', 'privacy']),
};

export type TermsPageServerSearchParams = inferParserType<typeof termsParserMap>;

export const TermsPageSearchParamsGenerator = {
  getAdminSafeSearchParams: async (
    searchParams: Promise<SearchParams>,
  ): Promise<TermsPageServerSearchParams> => {
    const searchParamsAdapter = new ServerSearchParamsAdapter(termsParserMap);
    return searchParamsAdapter.getSafeSearchParam(searchParams);
  },
};
