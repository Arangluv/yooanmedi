import { createLoader, SearchParams, parseAsStringEnum } from 'nuqs/server';
import { PAGE_TYPE, FindIdPage, ResetPasswordPage } from '@/views/client/FindPage';

type Props = {
  searchParams: Promise<SearchParams>;
};

export default async function FindPage({ searchParams }: Props) {
  const searchParamsLoader = createLoader({
    type: parseAsStringEnum(Object.values(PAGE_TYPE)).withDefault(PAGE_TYPE.id),
  });
  const { type: pageType } = await searchParamsLoader(searchParams);

  return pageType === PAGE_TYPE.id ? <FindIdPage /> : <ResetPasswordPage />;
}
