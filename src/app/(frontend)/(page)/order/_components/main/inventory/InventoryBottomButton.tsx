'use client'

import { Badge } from '@heroui/react'
import { CreditCard } from 'lucide-react'
import { InventoryContext, InventoryModalContext } from '@order/_context/order_context'
import { useContext } from 'react'

export default function Inventory() {
  const { onOpen } = useContext(InventoryModalContext)
  const { inventory } = useContext(InventoryContext)

  return (
    <div className="fixed bottom-6 right-8">
      <Badge content={inventory.length} color="danger" placement="top-right" size="lg">
        <button
          className="min-w-24 h-20 bg-brand rounded-md flex items-center gap-2 px-4 justify-center hover:bg-brandWeek transition-colors duration-300 cursor-pointer"
          onClick={onOpen}
        >
          <CreditCard className="w-6 h-6 text-white" />
          <span className="text-white font-bold text-lg">결제하기</span>
        </button>
      </Badge>
    </div>
  )
}
