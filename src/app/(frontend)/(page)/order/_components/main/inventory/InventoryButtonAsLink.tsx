'use client'

import { useContext } from 'react'
import { InventoryModalContext } from '@order/_context/order_context'

export default function InventoryButtonAsLink() {
  const { onOpen } = useContext(InventoryModalContext)

  return (
    <button className="text-foreground-700 cursor-pointer" onClick={() => onOpen()}>
      장바구니
    </button>
  )
}
