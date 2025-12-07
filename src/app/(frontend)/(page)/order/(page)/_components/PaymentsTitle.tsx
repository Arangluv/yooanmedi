import { ChevronRight } from 'lucide-react'

export default function PaymentsTitle() {
  return (
    <div className="w-full flex justify-between items-center my-4 pb-4 border-b-2 border-foreground-200">
      <div className="">
        <span className="text-3xl font-bold">주문 결제</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="text-foreground-600">장바구니</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-brand font-bold">주문 결제</span>
        <ChevronRight className="w-4 h-4" />
        <span className="text-foreground-600">주문완료</span>
      </div>
    </div>
  )
}
