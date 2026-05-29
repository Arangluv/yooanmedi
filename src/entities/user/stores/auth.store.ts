import { redirect } from 'next/navigation';
import { toast } from 'sonner';
import { createStore } from 'zustand';
import { User } from '../types';
import { getUserByHeader } from '../api/get-user-by-header';
import { logout } from '../api/auth/logout';

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
      const newUser = await getUserByHeader();
      if (!newUser) {
        return set({ user: initProps.user });
      }

      return set({ user: newUser as User }); // todo :: 해당 부분 타입단언 제거하기
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
