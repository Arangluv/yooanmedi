'use client';

import { Fragment } from 'react';
import moment from 'moment';

import OrderStatusBadge from '@/entities/order/ui/admin/badge';
import { useOrderCollection } from '../model/order-provider';
import { ORDER_STATUS } from '@/entities/order';
import EmptyOrderInfo from '@/entities/order/ui/admin/EmptyOrderInfo';
import { OrderStatus } from '@/entities/order/constants/order-status';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui/shadcn/card';
import { ItemGroup, ItemSeparator } from '@/shared/ui/shadcn/item';

import OrderProductItem from './OrderProductItem';
import { OrderAction } from '../model/order-action-dialog-provider';
import { ORDER_DETAIL_UI_CONFIG, OrderInfomationCardType } from '../config/order-detail-ui-config';
import { OrderProduct } from '../model/order-detail-schema';

interface OrderInfoCardProps {
  type: OrderInfomationCardType;
  orderId: number;
  orderStatus: OrderStatus;
  orderNo: string;
  date: string;
  orderProducts: OrderProduct[];
  children?: React.ReactNode;
}

const OrderInfoCard = ({
  type,
  orderStatus,
  orderNo,
  date,
  orderProducts,
  orderId,
  children,
}: OrderInfoCardProps) => {
  const uiConfig = ORDER_DETAIL_UI_CONFIG[type];
  const isEmpty = orderProducts.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>{uiConfig.title}</span>
          <OrderStatusBadge orderStatus={orderStatus} />
        </CardTitle>
        <CardDescription className="flex flex-row gap-2 text-lg">
          <span>#{orderNo}</span>•<span>{moment(date).format('YYYY-MM-DD HH:mm:ss')} 생성</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyOrderInfo title="주문 정보가 없습니다." />
        ) : (
          <ItemGroup>
            {orderProducts.map((orderProduct, idx) => {
              return (
                <Fragment key={orderProduct.id}>
                  <OrderProductItem
                    orderId={orderId}
                    idx={idx}
                    orderProduct={orderProduct}
                    isCancelAction={uiConfig.canItemCancel}
                  />
                  <ItemSeparator className="last:hidden" />
                </Fragment>
              );
            })}
          </ItemGroup>
        )}
      </CardContent>
      {children}
    </Card>
  );
};

export const OrderProgressInfoCard = () => {
  const {
    orderInfo: { progressOrder, orderNo, createdAt, id: orderId },
  } = useOrderCollection();

  const isEmpty = progressOrder.orderProducts.length === 0;

  if (!progressOrder.inProgressOrderStatus) {
    return null;
  }

  return (
    <OrderInfoCard
      type="progress"
      orderId={orderId}
      orderStatus={progressOrder.inProgressOrderStatus}
      orderNo={orderNo}
      date={createdAt}
      orderProducts={progressOrder.orderProducts}
    >
      {!isEmpty && (
        <CardFooter className="justify-end">
          <OrderAction.ProceedTrigger
            display={{
              count: progressOrder.orderProducts.length,
              viewType: 'order-detail',
            }}
            targetOrderIds={[orderId]}
            currentStatus={progressOrder.inProgressOrderStatus}
          />
        </CardFooter>
      )}
      {/* Dialog Modal Contents */}
      <OrderAction.ProceedContent />
      <OrderAction.CancelContent />
    </OrderInfoCard>
  );
};

export const OrderCancelRequestInfoCard = () => {
  const {
    orderInfo: { cancelRequestOrder, orderNo, updatedAt, id: orderId },
  } = useOrderCollection();

  const isEmpty = cancelRequestOrder.orderProducts.length === 0;

  return (
    <OrderInfoCard
      type="cancelRequest"
      orderId={orderId}
      orderStatus={ORDER_STATUS.CANCEL_REQUEST}
      date={updatedAt}
      orderNo={orderNo}
      orderProducts={cancelRequestOrder.orderProducts}
    >
      {!isEmpty && (
        <CardFooter className="justify-end">
          <OrderAction.CancelTrigger
            display={{
              count: cancelRequestOrder.orderProducts.length,
              viewType: 'order-detail',
            }}
            targetOrderIds={[orderId]}
            currentStatus={ORDER_STATUS.CANCEL_REQUEST}
          />
        </CardFooter>
      )}
      {/* Dialog Modal Contents */}
      <OrderAction.CancelContent />
    </OrderInfoCard>
  );
};

export const OrderCancelledInfoCard = () => {
  const {
    orderInfo: { cancelledOrder, orderNo, updatedAt, id: orderId },
  } = useOrderCollection();

  return (
    <OrderInfoCard
      type="cancelled"
      orderId={orderId}
      orderStatus={ORDER_STATUS.CANCELLED}
      date={updatedAt}
      orderNo={orderNo}
      orderProducts={cancelledOrder.orderProducts}
    />
  );
};
