import { parseAsStringLiteral, inferParserType } from 'nuqs';

const termsParserMap = {
  type: parseAsStringLiteral(['terms', 'privacy']).withDefault('terms'),
};

export type TermsPageSearchParams = inferParserType<typeof termsParserMap>;
