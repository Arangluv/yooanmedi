import Link from 'next/link';
import { JSX } from 'react';
import { SearchParams } from 'nuqs/server';
import { Header } from '@/widget/Header';
import {
  TermsPageSearchParamsGenerator,
  TermsApiRepository,
  TermsAdapter,
} from '@/entities/terms/infrastructure';
import { PayloadRichTextRenderer } from '@/shared';

type TermsPageProps = {
  searchParams: Promise<SearchParams>;
};

export const TermsPage = async ({ searchParams }: TermsPageProps): Promise<JSX.Element> => {
  const { type } = await TermsPageSearchParamsGenerator.getAdminSafeSearchParams(searchParams);
  const termsRepository = new TermsApiRepository(TermsAdapter());

  const terms =
    type === 'terms'
      ? await termsRepository.getTermsOfUse()
      : await termsRepository.getPrivacyPolicy();

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <Header />
      </div>
      <div className="bg-foreground-200 mb-8 h-[1px] w-full"></div>
      <div className="flex w-full max-w-5xl flex-col">
        <ul className="mb-12 flex w-full items-center">
          <li className='after:mx-2 after:text-sm after:content-[">"]'>
            <Link
              href="/"
              className="text-foreground-600 hover:text-foreground-800 text-sm transition-colors duration-300"
            >
              홈
            </Link>
          </li>
          <li>
            <Link
              href="/"
              className="text-foreground-700 hover:text-foreground-800 text-sm transition-colors duration-300"
            >
              {type === 'terms' ? '이용약관' : '개인정보처리방침'}
            </Link>
          </li>
        </ul>
        <section className="mb-12 w-full">
          <PayloadRichTextRenderer content={terms.content} />
        </section>
      </div>
    </div>
  );
};
