'use client';

import { create } from 'zustand';

type SiteMetaStore = {
  minOrderPrice: number;
  setMinOrderPrice: (minOrderAmount: number) => void;
};

const useSiteMetaStore = create<SiteMetaStore>((set) => ({
  minOrderPrice: 0,
  setMinOrderPrice: (minOrderPrice) => set({ minOrderPrice }),
}));

export default useSiteMetaStore;
