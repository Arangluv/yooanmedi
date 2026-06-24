'use client';

import { create } from 'zustand';

interface CartModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
}

// todo :: zustand store 객체를 어떻게 관리할지에 대한 고민
export const useCartModalStore = create<CartModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onOpenChange: (openState) => set({ isOpen: openState }),
}));
