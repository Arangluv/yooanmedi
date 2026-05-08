import PaymentInfo from './PaymentInfo';
import OrderUserInfo from './OrderUserInfo';
import DeliveryInfo from './DeliveryInfo';
import {
  OrderCancelledInfoCard,
  OrderCancelRequestInfoCard,
  OrderProgressInfoCard,
} from './order-info-card';
import { OrderCollectionProvider } from '../model/order-provider';
import { OrderAction } from '../model/order-action-dialog-provider';
import { OrderDetailHydrationProvider } from '../model/providers/OrderDetailHydrationProvider';
import { getOrderDetail } from '../api/order-detail.api';

interface AdminOrderDetailPageProps {
  doc: {
    id: number;
  };
}

const AdminOrderDetailPage = async ({ doc }: AdminOrderDetailPageProps) => {
  const result = await getOrderDetail(doc.id);

  // todo :: 에러경계를 활용하여 분리해야합니다
  if (!result.isSuccess) {
    throw new Error(result.message);
  }

  return (
    <OrderCollectionProvider orderId={doc.id}>
      <OrderDetailHydrationProvider orderId={doc.id} initialData={result}>
        <OrderAction>
          {/*  */}
          <div className="bg-muted dark:bg-background h-full w-full px-[60px] py-[30px]">
            <div className="flex gap-12">
              {/* segment 1 */}
              <section className="flex w-[70%] flex-col gap-6">
                {/* 주문 정보 */}
                <OrderProgressInfoCard orderId={result.data.id} />
                <OrderCancelRequestInfoCard orderId={result.data.id} />
                <OrderCancelledInfoCard orderId={result.data.id} />
              </section>
              {/* segment 2 */}
              <section className="flex w-[30%] flex-col gap-6">
                {/* 결제 정보 */}
                <PaymentInfo />
                {/* 주문자 */}
                <OrderUserInfo />
                {/* 배송지 정보 */}
                <DeliveryInfo />
              </section>
            </div>
          </div>
        </OrderAction>
      </OrderDetailHydrationProvider>
    </OrderCollectionProvider>
  );
};

export default AdminOrderDetailPage;
