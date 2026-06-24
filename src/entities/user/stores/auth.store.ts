import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { createStore } from 'zustand';
import { User } from '../types';
import { getUserByHeader, logout } from '../api';

export interface AuthProps {
  user: User;
}

export interface AuthState extends AuthProps {
  logout: () => void;
  refreshUser: () => Promise<void>;
}

export const createUseAuthStore = (initProps: AuthProps) => {
  return createStore<AuthState>((set) => ({
    user: initProps.user,
    refreshUser: async () => {
      const result = await getUserByHeader();
      if (!result.isSuccess) {
        return set({ user: initProps.user });
      }

      return set({ user: result.data });
    },
    logout: async () => {
      const result = await logout();
      if (result.isSuccess) {
        return redirect('/');
      } else {
        toast.error(result.message);
      }
    },
  }));
};

export type AuthStore = ReturnType<typeof createUseAuthStore>;
