'use client';

import { Product } from '@/entities/product';
import { create } from 'zustand';

type ProductDetailStore = {
  clieckedProduct: Product | null;
  setClieckedProduct: (targetProduct: Product | null) => void;
};

// todo:: store와 hook을 따로 분리
export const useProductDetailStore = create<ProductDetailStore>((set) => ({
  clieckedProduct: null,
  setClieckedProduct: (targetProduct) => set({ clieckedProduct: targetProduct }),
}));
