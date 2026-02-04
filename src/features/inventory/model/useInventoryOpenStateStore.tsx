'use client';

import { useDisclosure } from '@heroui/react';

import { create } from 'zustand';

type InventoryOpenStateStore = {
  isOpen: boolean;
  onOpen: () => void;
  onOpenChange: (isOpen: boolean) => void;
};

// useDisclosure를 대체하는 상태관리 로직, 요구사항으로 인해 전역으로 관리할 수 밖에 없음
// modal feature 내부에서만 사용 -> 외부 export X
const useInventoryOpenStateStore = create<InventoryOpenStateStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onOpenChange: (openState) => set({ isOpen: openState }),
}));

export default useInventoryOpenStateStore;
