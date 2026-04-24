'use client';

import { Product } from '@/entities/product';
import { create } from 'zustand';

type ProductDetailStore = {
  clieckedProduct: Product | null;
  setClieckedProduct: (targetProduct: Product | null) => void;
};

const useProductDetailStore = create<ProductDetailStore>((set) => ({
  clieckedProduct: null,
  setClieckedProduct: (targetProduct) => set({ clieckedProduct: targetProduct }),
}));

export default useProductDetailStore;
