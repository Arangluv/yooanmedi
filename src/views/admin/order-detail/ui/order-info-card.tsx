'use client';

import { Fragment } from 'react';
import moment from 'moment';
import OrderStatusBadge from '@/entities/order/ui/admin/badge';
import EmptyOrderInfo from '@/entities/order/ui/admin/EmptyOrderInfo';
import { ORDER_STATUS, OrderStatus } from '@/entities/order/constants/order-status';
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
import { ORDER_DETAIL_UI_CONFIG, OrderInfomationCardType } from '../config/order-detail-ui-config';
import { TransitionDialogTrigger } from './dialogs';
import { OrderDetailDto, OrderDetailOrderProductReference } from '@/features/order/order-detail';
import { useOrderDetail } from '@/features/order/order-detail';

interface OrderInfoCardProps {
  type: OrderInfomationCardType;
  order: OrderDetailDto;
  status: OrderStatus | null;
  date: string;
  orderProducts: OrderDetailOrderProductReference[];
  children?: React.ReactNode;
}

const OrderInfoCard = ({
  type,
  order,
  orderProducts,
  status,
  date,
  children,
}: OrderInfoCardProps) => {
  const uiConfig = ORDER_DETAIL_UI_CONFIG[type];
  const isEmpty = orderProducts.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>{uiConfig.title}</span>
          <OrderStatusBadge orderStatus={status} />
        </CardTitle>
        <CardDescription className="flex flex-row gap-2 text-lg">
          <span>#{order.orderNo}</span>•
          <span>{moment(date).format('YYYY-MM-DD HH:mm:ss')} 생성</span>
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
                  <OrderProductItem order={order} idx={idx} orderProduct={orderProduct} />
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

  const isNotVisible =
    status === ORDER_STATUS.delivered ||
    status === ORDER_STATUS.cancelled ||
    orderProducts.length === 0 ||
    status === null;

  return (
    <OrderInfoCard
      type="progress"
      order={orderDetail}
      orderProducts={orderProducts}
      status={status}
      date={orderDetail.createdAt}
    >
      {isNotVisible ? null : (
        <CardFooter className="justify-end">
          <TransitionDialogTrigger order={orderDetail} status={status} />
        </CardFooter>
      )}
    </OrderInfoCard>
  );
};

export const OrderCancelRequestInfoCard = ({ orderId }: { orderId: number }) => {
  const { orderDetail, getCancelRequestOrderProductContext } = useOrderDetail(orderId);
  const { orderProducts } = getCancelRequestOrderProductContext();

  return (
    <OrderInfoCard
      type="cancelRequest"
      order={orderDetail}
      orderProducts={orderProducts}
      status={ORDER_STATUS.cancel_request}
      date={orderDetail.createdAt}
    />
  );
};

export const OrderCancelledInfoCard = ({ orderId }: { orderId: number }) => {
  const { orderDetail, getCancelledProductContext } = useOrderDetail(orderId);
  const { orderProducts } = getCancelledProductContext();

  return (
    <OrderInfoCard
      type="cancelled"
      order={orderDetail}
      orderProducts={orderProducts}
      status={ORDER_STATUS.cancelled}
      date={orderDetail.createdAt}
    />
  );
};
