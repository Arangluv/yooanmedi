import Link from 'next/link';
import Navbar from '../../_components/Navbar';
import { notFound } from 'next/navigation';
import { getPayload } from '@/shared/server';
import { ContentRenderer } from '@/shared';

export default async function TermsPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string }>;
}) {
  const { type } = await searchParams;

  if (!type || (type !== 'terms' && type !== 'privacy')) {
    return notFound();
  }

  const payload = await getPayload();
  const { content } = await payload.findGlobal({
    slug: type === 'terms' ? 'terms' : 'privacy-policy',
  });

  return (
    <div className="flex w-full flex-col items-center justify-center">
      <div className="w-full max-w-5xl">
        <Navbar />
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
          <ContentRenderer content={content} />
        </section>
      </div>
    </div>
  );
}
