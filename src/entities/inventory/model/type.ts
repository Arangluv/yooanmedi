import type { Product } from '@/entities/product/@x/inventory';

export type InventoryItem = {
  product: Product;
  quantity: number;
};

export type Inventory = {
  inventory: Array<InventoryItem>;
  setInventory: (inventory: InventoryItem) => void;
};
