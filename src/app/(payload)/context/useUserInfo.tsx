'use client';

import { create } from 'zustand';

export type TargetUser = {
  id: number;
  hosipital_name: string;
  ceo_name: string;
  email: string;
};

type UserInfoState = {
  user: TargetUser;
  setUser: (user: TargetUser) => void;
};

const useUserInfo = create<UserInfoState>((set) => ({
  user: {} as TargetUser,
  setUser: (user: TargetUser) => set({ user }),
}));

export default useUserInfo;
