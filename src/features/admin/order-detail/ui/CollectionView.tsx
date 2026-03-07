import PaymentInfo from './PaymentInfo';
import OrderUserInfo from './OrderUserInfo';
import DeliveryInfo from './DeliveryInfo';
import { OrderCollectionProvider } from '../model/order-provider';
import {
  OrderCancelledInfoCard,
  OrderCancelRequestInfoCard,
  OrderProgressInfoCard,
} from './order-info-card';
import { OrderAction } from '../model/order-action-dialog-provider';

interface CollectionDocumentViewProps {
  doc: {
    id: number;
  };
}

const CollectionView = ({ doc }: CollectionDocumentViewProps) => {
  return (
    <OrderCollectionProvider orderId={doc.id}>
      <OrderAction>
        <div className="bg-muted dark:bg-background h-full w-full px-[60px] py-[30px]">
          <div className="flex gap-12">
            <section className="flex w-[70%] flex-col gap-6">
              {/* 주문 정보 */}
              <OrderProgressInfoCard />
              <OrderCancelRequestInfoCard />
              <OrderCancelledInfoCard />
            </section>
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
    </OrderCollectionProvider>
  );
};

export default CollectionView;
