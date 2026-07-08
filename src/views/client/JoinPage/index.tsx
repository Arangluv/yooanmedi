import { JSX } from 'react';
import { JoinHeader, JoinForm } from '@/features/auth/join';

export const JoinPage = (): JSX.Element => {
  return (
    <section className="flex w-full items-center justify-center bg-neutral-50 py-12">
      <div className="flex w-full max-w-2xl flex-col">
        <JoinHeader />
        <JoinForm />
      </div>
    </section>
  );
};
