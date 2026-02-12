import { BrandLogo } from '@/shared';
import FindTabs from './_components/FindTabs';
import { notFound } from 'next/navigation';
import FindPassword from './_components/FindPassword';
import FindId from './_components/FindId';
import { Info } from 'lucide-react';
import Link from 'next/link';

export default async function FindPage({
  searchParams,
}: {
  searchParams: Promise<{ type: string }>;
}) {
  const { type } = await searchParams;

  if (!type || (type !== 'id' && type !== 'password')) {
    return notFound();
  }

  return (
    <section className="flex w-full items-center justify-center py-12">
      <div className="flex w-full max-w-2xl flex-col">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4">
          <Link href="/" className="flex w-full justify-center">
            <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
          </Link>
          <h1 className="text-foreground-900 text-3xl font-bold">아이디 비밀번호 찾기</h1>
        </div>
        <div className="flex w-full flex-col gap-6 rounded-2xl px-8 py-12">
          <FindTabs />
          <div className="mb-4 flex w-full items-center gap-4 rounded-md bg-neutral-50 p-4">
            <Info className="text-foreground-500 h-5 w-5" />
            <div className="flex flex-col gap-1">
              <span className="text-foreground-500 text-sm">
                <span className="text-brandWeek font-medium">비밀번호는 암호화되어 저장</span>되기
                때문에 <span className="text-brandWeek font-medium">재설정만 가능</span>합니다.
              </span>
              <span className="text-foreground-500 text-sm">
                기타 문의사항은 <span className="text-brandWeek font-medium">031-893-0806</span>으로
                문의 부탁드립니다.
              </span>
            </div>
          </div>
          {type === 'id' ? <FindId /> : <FindPassword />}
        </div>
      </div>
    </section>
  );
}
