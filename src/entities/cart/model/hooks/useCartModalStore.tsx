'use client';

import { create } from 'zustand';

interface CartModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

const useCartModalStore = create<CartModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onOpenChange: (openState) => set({ isOpen: openState }),
}));

export default useCartModalStore;
