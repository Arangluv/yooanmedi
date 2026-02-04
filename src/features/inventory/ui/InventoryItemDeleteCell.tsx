'use client';

import { Trash } from 'lucide-react';

import { useInventoryStore } from '@/entities/inventory';
import { InventoryItem } from '@/entities/inventory';

const InventoryItemDeleteCell = ({ inventoryItem }: { inventoryItem: InventoryItem }) => {
  const { removeInventory } = useInventoryStore();

  return (
    <div className="mx-auto flex w-fit justify-center">
      <button className="cursor-pointer" onClick={() => removeInventory(inventoryItem)}>
        <Trash className="text-danger-400 h-4 w-4 cursor-pointer" />
      </button>
    </div>
  );
};

export default InventoryItemDeleteCell;
