import PaymentInfo from './PaymentInfo';
import OrderUserInfo from './OrderUserInfo';
import DeliveryInfo from './DeliveryInfo';
import { OrderCollectionProvider } from '../model/order-provider';
import { OrderCancelledInfo, OrderCancelRequestInfo, OrderProgressInfo } from './order-info';
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
              <OrderProgressInfo title="주문 정보" />
              <OrderCancelRequestInfo title="주문취소 요청" />
              <OrderCancelledInfo title="취소된 주문" />
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
