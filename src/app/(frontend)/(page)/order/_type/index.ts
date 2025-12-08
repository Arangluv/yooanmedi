export type OrderContextUserType = {
  role: string
  isApproved: boolean
  username: string
  hospitalName: string
  point: number
  email: string
  phoneNumber: string
  address: string
}

export type SearchParamsType = {
  condition: 'pn' | 'cn' | null | undefined
  keyword: string | null | undefined
  page: string | null | undefined
  category: string | null | undefined
}

export type ProductItemType = {
  id: number
  name: string
  price: number
  manufacturer: string
  specification: string | null | undefined
  image: {
    url: string
    alt: string | null
  }
  cashback_rate: number
  insurance_code: string | null | undefined
  stock: number
  delivery_fee: number
  returnable: boolean
}

export type InventoryType = {
  inventory: Array<{
    product: ProductItemType
    quantity: number
  }>
  setInventory: (
    inventory: Array<{
      product: ProductItemType
      quantity: number
    }>,
  ) => void
}

export type PaymentRegisterDto = {
  mallId: string
  payMethodTypeCode: '11' // 결제수단 코드로 유안메디팜은 신용카드로 밖에 결제못한다
  amount: number
  shopOrderNo: string // 고유한 주문번호
  currency: '00' // 통화 코드로 유안메디팜은 원화로 결제한다
  returnUrl: string
  deviceTypeCode: 'mobile' | 'pc'
  clientTypeCode: '00' // 고정값,
  orderInfo: {
    goodsName: string
    customerInfo: {
      customerId: string
      customerName: string
      customerMail: string
      customerContactNo: string // 단 숫자만 허용
      customerAddr: string
    }
  }
  shopValueInfo: {
    value1?: string
    value2?: string
    value3?: string
    // 6까지 추가할 수 있다
  }
}
