'use client';

import { createContext, useState } from 'react';
import { AuthProps, AuthStore, createUseAuthStore } from '../stores';

export const AuthStoreContext = createContext<AuthStore | null>(null);

export const AuthStoreProvider = ({
  children,
  initProps,
}: {
  children: React.ReactNode;
  initProps: AuthProps;
}) => {
  const [authStore] = useState(() => createUseAuthStore(initProps));

  return <AuthStoreContext.Provider value={authStore}>{children}</AuthStoreContext.Provider>;
};
