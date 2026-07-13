import React from 'react';
import { Header } from '@/widget/Header';
import { FindAuthInfoTabs } from '@/views/client/FindPage/ui';

type Props = { children: React.ReactNode };

export const FindPageLayout = async ({ children }: Props) => {
  return (
    <section className="flex w-full items-center justify-center">
      <div className="flex w-full max-w-2xl flex-col gap-16">
        <Header />
        {children}
      </div>
    </section>
  );
};
