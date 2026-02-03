'use client';

import { create } from 'zustand';

import type { User } from './user';

type AuthStore = {
  user: User | null;
  setUser: (user: User | null) => void;
  // TODO : 추후 Refactoing 시 추가
  // login: (user: User) => void;
  // logout: () => void;
};

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  setUser: (user: User | null) => set({ user }),
}));

export default useAuthStore;
