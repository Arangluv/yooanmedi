'use client';

import { useEffect, useState } from 'react';

import { Button, NumberInput } from '@heroui/react';
import { Minus, Plus } from 'lucide-react';

import { useInventoryStore } from '@/entities/inventory';
import { InventoryItem } from '@/entities/inventory';

const InventoryQuantityEditCell = ({ inventoryItem }: { inventoryItem: InventoryItem }) => {
  const [value, setValue] = useState(1);
  const { updateInventory } = useInventoryStore();

  useEffect(() => {
    updateInventory({ product: inventoryItem.product, quantity: value });
  }, [value]);

  return (
    <div className="mx-auto flex w-fit items-center gap-1">
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="border-foreground-200 border-1 bg-neutral-50"
        onPress={() => setValue(value - 1 < 1 ? 1 : value - 1)}
      >
        <Minus className="h-3 w-3" strokeWidth={1.5} />
      </Button>
      <NumberInput
        aria-label="수량"
        size="sm"
        hideStepper
        radius="sm"
        variant="bordered"
        minValue={1}
        maxValue={999}
        defaultValue={1}
        value={value}
        onValueChange={(value) => setValue(value)}
        classNames={{ base: 'w-fit', inputWrapper: 'h-5 w-12 border-1 shadow-none' }}
      />
      <Button
        isIconOnly
        size="sm"
        variant="light"
        className="border-foreground-200 border-1 bg-neutral-50"
        onPress={() => setValue(value + 1 > 999 ? 999 : value + 1)}
      >
        <Plus className="h-3 w-3" strokeWidth={1.5} />
      </Button>
    </div>
  );
};

export default InventoryQuantityEditCell;
