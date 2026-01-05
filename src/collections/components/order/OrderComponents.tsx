import OrderListExport from './OrderListExport'
import OrderPaymentPendingToReady from './OrderPaymentPendingToReady'

export default function OrderComponents(props: any) {
  return (
    <div className="w-full flex gap-4 justify-between">
      <div className="flex gap-2">
        <OrderPaymentPendingToReady {...props} />
      </div>
      <OrderListExport {...props} />
    </div>
  )
}
