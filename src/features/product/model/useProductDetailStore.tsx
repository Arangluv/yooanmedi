'use client';

import { ProductItem } from '@/entities/product/model/types';
import { create } from 'zustand';

type ProductDetailStore = {
  clieckedProduct: ProductItem | null;
  setClieckedProduct: (targetProduct: ProductItem | null) => void;
};

const useProductDetailStore = create<ProductDetailStore>((set) => ({
  clieckedProduct: null,
  setClieckedProduct: (targetProduct) => set({ clieckedProduct: targetProduct }),
}));

export default useProductDetailStore;
