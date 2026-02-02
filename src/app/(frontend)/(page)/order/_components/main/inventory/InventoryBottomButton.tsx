'use client';

import { Badge } from '@heroui/react';
import { CreditCard } from 'lucide-react';
import {
  InventoryContext,
  InventoryModalContext,
} from '@/app/(frontend)/(page)/order/_context/order_context';
import { useContext } from 'react';

export default function Inventory() {
  const { onOpen } = useContext(InventoryModalContext);
  const { inventory } = useContext(InventoryContext);

  return (
    <div className="fixed right-8 bottom-6">
      <Badge content={inventory.length} color="danger" placement="top-right" size="lg">
        <button
          className="bg-brand hover:bg-brandWeek flex h-20 min-w-24 cursor-pointer items-center justify-center gap-2 rounded-md px-4 transition-colors duration-300"
          onClick={onOpen}
        >
          <CreditCard className="h-6 w-6 text-white" />
          <span className="text-lg font-bold text-white">결제하기</span>
        </button>
      </Badge>
    </div>
  );
}
