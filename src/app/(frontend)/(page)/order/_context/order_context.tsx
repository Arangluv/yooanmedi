'use client'

import { useDisclosure } from '@heroui/react'
import { createContext, useEffect, useState } from 'react'
import { InventoryType, ProductItemType } from '../_type'

type OrderContextUserType = {
  user: {
    role: string
    isApproved: boolean
    username: string
    hospitalName: string
    point: number
    email: string
    phoneNumber: string
    address: string
    id: number
  } | null
  setUser: (
    user: {
      role: string
      isApproved: boolean
      username: string
      hospitalName: string
      point: number
      email: string
      phoneNumber: string
      address: string
      id: number
    } | null,
  ) => void
}

// 유저 정보 컨텍스트
export const OrderUserInfoContext = createContext<OrderContextUserType>({
  user: null,
  setUser: () => {},
})

export const OrderUserInfoProvider = ({
  initialUser,
  children,
}: {
  initialUser: OrderContextUserType['user']
  children: React.ReactNode
}) => {
  const [user, setUser] = useState<OrderContextUserType['user']>(null)

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser)
    } else {
      setUser(null)
    }
  }, [initialUser])

  return (
    <OrderUserInfoContext.Provider value={{ user, setUser }}>
      {children}
    </OrderUserInfoContext.Provider>
  )
}

// 모달 관리

type InventoryModalContextType = {
  isOpen: boolean
  onOpen: () => void
  onOpenChange: (open: boolean) => void
}

export const InventoryModalContext = createContext<InventoryModalContextType>({
  isOpen: false,
  onOpen: () => {},
  onOpenChange: () => {},
})

export const InventoryModalProvider = ({ children }: { children: React.ReactNode }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <InventoryModalContext.Provider value={{ isOpen, onOpen, onOpenChange }}>
      {children}
    </InventoryModalContext.Provider>
  )
}

// 상품정보

type ProductInfoContextType = {
  clickedProduct: ProductItemType | null
  setClickedProduct: (product: ProductItemType | null) => void
}

export const ProductInfoContext = createContext<ProductInfoContextType>({
  clickedProduct: null,
  setClickedProduct: () => {},
})

export const ProductInfoProvider = ({ children }: { children: React.ReactNode }) => {
  const [clickedProduct, setClickedProduct] =
    useState<ProductInfoContextType['clickedProduct']>(null)

  return (
    <ProductInfoContext.Provider value={{ clickedProduct, setClickedProduct }}>
      {children}
    </ProductInfoContext.Provider>
  )
}

// 장바구니

export const InventoryContext = createContext<InventoryType>({
  inventory: [],
  setInventory: () => {},
})

export const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const [inventory, setInventory] = useState<InventoryType['inventory']>([])

  return (
    <InventoryContext.Provider value={{ inventory, setInventory }}>
      {children}{' '}
    </InventoryContext.Provider>
  )
}
