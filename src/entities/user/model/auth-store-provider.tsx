'use client';

import { createContext, useState } from 'react';
import { createStore } from 'zustand';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

import type { User } from './type';
import { logout } from '../api/auth/logout';
import { getUserByHeader } from '../api/get-user-by-header';

export interface AuthProps {
  user: User;
}

export interface AuthState extends AuthProps {
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const createUseAuthStore = (initProps: AuthProps) => {
  return createStore<AuthState>((set) => ({
    user: initProps.user,
    refreshUser: async () => {
      const newUser = await getUserByHeader();
      if (!newUser) {
        return set({ user: initProps.user });
      }

      return set({ user: newUser });
    },
    logout: async () => {
      const res = await logout();
      if (res.success) {
        return redirect('/');
      } else {
        toast.error(res.message);
      }
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
