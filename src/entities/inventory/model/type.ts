import type { ProductItem } from '@/entities/product/@x/inventory';

export type InventoryItem = {
  product: ProductItem;
  quantity: number;
};

export type Inventory = {
  inventory: Array<InventoryItem>;
  setInventory: (inventory: InventoryItem) => void;
};
