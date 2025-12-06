import Link from 'next/link'
import { getAuthUser } from './actions'
import { TriangleAlert } from 'lucide-react'
import {
  InventoryModalProvider,
  OrderUserInfoProvider,
  ProductInfoProvider,
} from './_context/order_context'
import { OrderContextUserType } from './_type'

export default async function OrderLayout({ children }: { children: React.ReactNode }) {
  const { user, message } = await getAuthUser()

  if (!user) {
    return (
      <div className="w-full h-screen flex flex-col gap-4 justify-center items-center">
        <span className="text-2xl font-bold text-danger flex items-center gap-1">
          <TriangleAlert className="w-5 h-5" />
          403 Forbidden
        </span>
        <span>{message}</span>
        <Link
          href="/"
          className="text-white transition-colors duration-300 text-[15px] px-4 py-2 rounded-md bg-brand hover:bg-brandWeek w-fit"
        >
          홈으로 이동
        </Link>
      </div>
    )
  }

  return (
    <OrderUserInfoProvider initialUser={user as OrderContextUserType}>
      <InventoryModalProvider>
        <ProductInfoProvider>{children}</ProductInfoProvider>
      </InventoryModalProvider>
    </OrderUserInfoProvider>
  )
}
