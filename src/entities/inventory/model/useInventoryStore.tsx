import { create } from 'zustand';
import type { InventoryItem } from './type';
import type { ProductItem } from '@/entities/product/@x/inventory';

type InventoryStore = {
  inventory: InventoryItem[];
  addInventory: (inventory: InventoryItem) => void;
  removeInventory: (inventory: InventoryItem) => void;
  isExistingProduct: (productId: number) => boolean;
  updateInventory: ({ product, quantity }: { product: ProductItem; quantity: number }) => void;
  clearInventory: () => void;
};

const useInventoryStore = create<InventoryStore>((set, get) => ({
  inventory: [],
  addInventory: (inventory) => set((state) => ({ inventory: [...state.inventory, inventory] })),
  removeInventory: (inventory) =>
    set((state) => ({
      inventory: state.inventory.filter((item) => item.product.id !== inventory.product.id),
    })),
  isExistingProduct: (productId) => get().inventory.some((item) => item.product.id === productId),
  updateInventory: ({ product, quantity }) =>
    set((state) => {
      const newInventory = state.inventory.map((item) =>
        item.product.id === product.id ? { ...item, quantity } : item,
      );

      return {
        inventory: newInventory,
      };
    }),
  clearInventory: () => set({ inventory: [] }),
}));

export default useInventoryStore;
