export type OrderContextUserType = {
  role: string
  isApproved: boolean
  username: string
  hospitalName: string
  point: number
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
}
