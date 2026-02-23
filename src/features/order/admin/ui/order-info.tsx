'use client';

import { Fragment } from 'react';
import moment from 'moment';

import { AlertDialogTrigger } from '@/shared/ui/shadcn/alert-dialog';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/shared/ui/shadcn/card';
import { ItemGroup, ItemSeparator } from '@/shared/ui/shadcn/item';
import { Button } from '@/shared/ui/shadcn/button';
import OrderStatusBadge from '@/entities/order/ui/admin/badge';
import { useOrderCollection } from '../model/order-provider';
import { ORDER_STATUS, PAYMENTS_METHOD } from '@/entities/order';
import EmptyOrderInfo from '@/entities/order/ui/admin/EmptyOrderInfo';

import OrderProductItem from './OrderProductItem';
import ProgressOrderActionButton from './ProgressOrderActionButton';

export const OrderProgressInfo = ({ title }: { title: string }) => {
  const { orderInfo } = useOrderCollection();

  const isEmpty = orderInfo?.progressOrder?.orderProducts.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>{title}</span>
          {orderInfo?.progressOrder?.orderStatus && (
            <OrderStatusBadge orderStatus={orderInfo.progressOrder.orderStatus} />
          )}
        </CardTitle>
        <CardDescription className="flex flex-row gap-2 text-lg">
          <span>#{orderInfo?.progressOrder?.orderNo}</span>•
          <span>{moment(orderInfo?.progressOrder?.date).format('YYYY-MM-DD HH:mm:ss')} 생성</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ItemGroup>
          {isEmpty ? (
            <EmptyOrderInfo title="주문 정보가 없습니다." />
          ) : (
            orderInfo?.progressOrder?.orderProducts.map((orderProduct, idx) => {
              if (idx === orderInfo?.progressOrder?.orderProducts.length - 1) {
                return (
                  <OrderProductItem
                    idx={idx}
                    orderProduct={orderProduct}
                    isCancelAction={true}
                    key={orderProduct.id}
                  />
                );
              }

              return (
                <Fragment key={orderProduct.id}>
                  <OrderProductItem idx={idx} orderProduct={orderProduct} isCancelAction={true} />
                  <ItemSeparator />
                </Fragment>
              );
            })
          )}
        </ItemGroup>
      </CardContent>
      {isEmpty ? null : (
        <CardFooter className="justify-end">
          {orderInfo?.progressOrder?.orderStatus && (
            <AlertDialogTrigger asChild>
              <ProgressOrderActionButton
                orderStatus={orderInfo.progressOrder.orderStatus}
                orderId={orderInfo.progressOrder.id}
              />
            </AlertDialogTrigger>
          )}
        </CardFooter>
      )}
    </Card>
  );
};

export const OrderCancelRequestInfo = ({ title }: { title: string }) => {
  const { orderInfo, paymentInfo } = useOrderCollection();

  if (paymentInfo?.paymentMethod === PAYMENTS_METHOD.CREDIT_CARD) {
    return null;
  }

  const isEmpty = orderInfo?.cancelRequestOrder?.orderProducts.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>{title}</span>
          <OrderStatusBadge orderStatus={ORDER_STATUS.CANCEL_REQUEST} />
        </CardTitle>
        <CardDescription className="flex flex-row gap-2 text-lg">
          <span>#{orderInfo?.cancelRequestOrder?.orderNo}</span>•
          <span>
            {moment(orderInfo?.cancelRequestOrder?.date).format('YYYY-MM-DD HH:mm:ss')} 생성
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyOrderInfo title="주문취소 요청이 없습니다." />
        ) : (
          <ItemGroup>
            {orderInfo?.cancelRequestOrder?.orderProducts.map((orderProduct, idx) => {
              if (idx === orderInfo?.cancelRequestOrder?.orderProducts.length - 1) {
                return (
                  <OrderProductItem
                    idx={idx}
                    orderProduct={orderProduct}
                    isCancelAction={false}
                    key={orderProduct.id}
                  />
                );
              }

              return (
                <Fragment key={orderProduct.id}>
                  <OrderProductItem idx={idx} orderProduct={orderProduct} isCancelAction={false} />
                  <ItemSeparator />
                </Fragment>
              );
            })}
          </ItemGroup>
        )}
      </CardContent>
      {isEmpty ? null : (
        <CardFooter className="justify-end">
          <AlertDialogTrigger asChild>
            <Button className="text-lg font-normal" variant="destructive">
              주문취소 처리
            </Button>
          </AlertDialogTrigger>
        </CardFooter>
      )}
    </Card>
  );
};

export const OrderCancelledInfo = ({ title }: { title: string }) => {
  const { orderInfo } = useOrderCollection();
  const isEmpty = orderInfo?.cancelledOrder?.orderProducts.length === 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-xl">
          <span>{title}</span>
          <OrderStatusBadge orderStatus={ORDER_STATUS.CANCELLED} />
        </CardTitle>
        <CardDescription className="flex flex-row gap-2 text-lg">
          <span>#{orderInfo?.cancelledOrder?.orderNo}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isEmpty ? (
          <EmptyOrderInfo title="취소된 주문이 없습니다." />
        ) : (
          <ItemGroup>
            {orderInfo?.cancelledOrder?.orderProducts.map((orderProduct, idx) => {
              if (idx === orderInfo?.cancelledOrder?.orderProducts.length - 1) {
                return (
                  <OrderProductItem
                    idx={idx}
                    orderProduct={orderProduct}
                    isCancelAction={false}
                    key={orderProduct.id}
                  />
                );
              }

              return (
                <Fragment key={orderProduct.id}>
                  <OrderProductItem idx={idx} orderProduct={orderProduct} isCancelAction={false} />
                  <ItemSeparator />
                </Fragment>
              );
            })}
          </ItemGroup>
        )}
      </CardContent>
    </Card>
  );
};
