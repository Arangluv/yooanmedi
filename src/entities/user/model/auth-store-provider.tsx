'use client';

import { createContext, useState } from 'react';

import { createStore } from 'zustand';

import type { User } from './type';

export interface AuthProps {
  user: User;
}

export interface AuthState extends AuthProps {
  // TODO : 추후 Refactoing 시 추가
  // login: (user: User) => void;
  // logout: () => void;
}

const createUseAuthStore = (initProps: AuthProps) => {
  return createStore<AuthState>(() => ({
    user: initProps.user,
  }));
};

export type AuthStore = ReturnType<typeof createUseAuthStore>;

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
