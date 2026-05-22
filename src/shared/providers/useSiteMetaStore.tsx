'use client';

import { create } from 'zustand';

type SiteMetaStore = {
  minOrderPrice: number;
  setMinOrderPrice: (minOrderAmount: number) => void;
};

// todo :: 훅을 개선 후 hooks 폴더 or 다른폴더로 이동시켜야 합니다.

export const useSiteMetaStore = create<SiteMetaStore>((set) => ({
  minOrderPrice: 0,
  setMinOrderPrice: (minOrderPrice) => set({ minOrderPrice }),
}));
