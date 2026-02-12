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
  refreshUser: () => Promise<void>;
}

const createUseAuthStore = (initProps: AuthProps) => {
  return createStore<AuthState>((set) => ({
    user: initProps.user,
    refreshUser: async () => {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
        cache: 'no-store',
      });

      // 타입 단언을 반드시 사용해야 하는가?
      const newUser = (await res.json()) as User | null;

      // TODO :: 이 부분 개선하기
      if (!newUser) {
        return set({ user: initProps.user });
      }

      return set({ user: newUser });
    },
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
