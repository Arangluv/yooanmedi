'use client';

import React, { FC } from 'react';
import { HeroUIProvider } from '@heroui/system';
import { TooltipProvider } from '@/shared/ui/shadcn';
import { useRouter } from 'next/navigation';

type Props = {
  children: React.ReactNode;
};

declare module '@react-types/shared' {
  interface RouterConfig {
    routerOptions: NonNullable<Parameters<ReturnType<typeof useRouter>['push']>[1]>;
  }
}

export const UIProvider: FC<Props> = ({ children }: Props) => {
  const router = useRouter();

  return (
    <HeroUIProvider navigate={router.push}>
      <TooltipProvider>{children}</TooltipProvider>
    </HeroUIProvider>
  );
};
