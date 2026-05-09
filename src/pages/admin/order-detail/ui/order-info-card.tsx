'use client';

import { Fragment } from 'react';
import moment from 'moment';
import OrderStatusBadge from '@/entities/order/ui/admin/badge';
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
import useOrderDetail from '../model/hooks/useOrderDetail';
import { OrderProduct } from '@/entities/order-product';

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
          <EmptyOrderInfo title={uiConfig.emptyContent} />
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

export const OrderProgressInfoCard = ({ orderId }: { orderId: number }) => {
  const { orderDetail, getProgressdOrderProductContext } = useOrderDetail(orderId);
  const { orderProducts, status } = getProgressdOrderProductContext();

  return (
    <OrderInfoCard
      type="progress"
      orderId={orderId}
      orderStatus={status as any}
      orderNo={orderDetail.orderNo}
      date={orderDetail.createdAt}
      orderProducts={orderProducts}
    >
      <CardFooter className="justify-end">
        <OrderAction.ProceedTrigger
          display={{
            count: orderProducts.length,
            viewType: 'order-detail',
          }}
          targetOrderIds={[orderId]}
          currentStatus={status as any}
        />
      </CardFooter>
      <OrderAction.ProceedContent />
      <OrderAction.CancelContent />
    </OrderInfoCard>
  );
};

export const OrderCancelRequestInfoCard = ({ orderId }: { orderId: number }) => {
  const { orderDetail, getCancelRequestOrderProductContext } = useOrderDetail(orderId);
  const { orderProducts, status } = getCancelRequestOrderProductContext();

  return (
    <OrderInfoCard
      type="cancelRequest"
      orderId={orderDetail.id}
      orderStatus={status}
      date={orderDetail.updatedAt}
      orderNo={orderDetail.orderNo}
      orderProducts={orderProducts}
    >
      <CardFooter className="justify-end">
        <OrderAction.CancelTrigger
          display={{
            count: orderProducts.length,
            viewType: 'order-detail',
          }}
          targetOrderIds={[orderId]}
          currentStatus={ORDER_STATUS.cancel_request}
        />
      </CardFooter>
      <OrderAction.CancelContent />
    </OrderInfoCard>
  );
};

export const OrderCancelledInfoCard = ({ orderId }: { orderId: number }) => {
  const { orderDetail, getCancelRequestOrderProductContext } = useOrderDetail(orderId);
  const { orderProducts, status } = getCancelRequestOrderProductContext();

  return (
    <OrderInfoCard
      type="cancelled"
      orderId={orderDetail.id}
      orderStatus={status}
      date={orderDetail.updatedAt}
      orderNo={orderDetail.orderNo}
      orderProducts={orderProducts}
    />
  );
};
