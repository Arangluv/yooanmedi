import { BrandLogo } from '@/shared';
import JoinForm from './_components/Form';
import Link from 'next/link';

export default function JoinPage() {
  return (
    <section className="flex w-full items-center justify-center bg-neutral-50 py-12">
      <div className="flex w-full max-w-2xl flex-col">
        {/* Header */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4">
          <Link href="/" prefetch={false} className="flex w-full justify-center">
            <BrandLogo width={140} height={40} className="h-[40px] w-[140px]" />
          </Link>
          <h1 className="text-foreground-900 text-3xl font-bold">회원가입</h1>
        </div>
        {/* Form */}
        <div className="flex w-full flex-col rounded-2xl bg-white px-8 py-12">
          <JoinForm />
        </div>
      </div>
    </section>
  );
}
