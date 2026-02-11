'use client';

import { Divider, toast } from '@heroui/react';
import { ImageIcon, Info } from 'lucide-react';
import moment from 'moment';

import { PAYMENTS_METHOD, PAYMENTS_METHOD_NAME } from '@/entities/order';
import { ORDER_STATUS, ORDER_STATUS_NAME } from '@/entities/order';
import { ORDER_PRODUCT_STATUS, ORDER_PRODUCT_STATUS_NAME } from '@/entities/order-product';
import { ExcelExportButton, formatNumberWithCommas, isPayloadImageRenderable } from '@/shared';
import { Button } from '@/shared';

import OrderListEmpty from './OrderListEmpty';
import type { OrderListItem, OrderProductItem } from '../lib/normalization';
import Image from 'next/image';

import { useMutation } from '@tanstack/react-query';
import { cancelOrderProduct } from '@/features/order';

const OrderList = ({ orderList }: { orderList: OrderListItem[] }) => {
  const { mutate: cancelOrderMutation } = useMutation({
    mutationFn: (orderProductId: number) => cancelOrderProduct(orderProductId),
    onSuccess: (data) => {
      if (data?.success) {
        // toast.success('주문이 취소되었습니다');
      } else {
        // toast.error(data?.message || '주문 취소에 실패했습니다');
      }
    },
    onError: () => {},
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <span className="text-xl font-bold">주문목록</span>
        <ExcelExportButton
          onClick={() => {
            console.log('엑셀 다운로드');
          }}
        />
      </div>
      <div className="flex w-full flex-col gap-4">
        {orderList.length > 0 ? (
          orderList.map((order) => (
            <OrderItem key={order.id} order={order} onCancelClick={cancelOrderMutation} />
          ))
        ) : (
          <OrderListEmpty />
        )}
      </div>
    </div>
  );
};

const OrderItem = ({
  order,
  onCancelClick,
}: {
  order: OrderListItem;
  onCancelClick: (orderProductId: number) => void;
}) => {
  return (
    <div className="border-foreground-200 flex w-full flex-col gap-6 rounded-md border p-6">
      {/* 주문 overview */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-foreground-500 text-sm">총 결제금액</span>
          <span className="text-brand text-sm font-bold">
            {formatNumberWithCommas(order.finalPrice)}원
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-foreground-500 text-sm">결제 방법</span>
          <span className="text-brand text-sm font-bold">
            {PAYMENTS_METHOD_NAME[order.paymentsMethod]}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-foreground-500 text-sm">주문일시</span>
          <span className="text-foreground-600 text-sm font-bold">
            {moment(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-foreground-500 text-sm">주문번호</span>
          <span className="text-foreground-600 text-sm font-bold">{order.orderNo}</span>
        </div>
      </div>
      <Divider />
      {order.paymentsMethod === PAYMENTS_METHOD.BANK_TRANSFER &&
        order.orderStatus === ORDER_STATUS.PENDING && <BankTransferPendingAlert />}
      {/* 구매 상품 리스트 영역 */}
      <div className="flex flex-col gap-6">
        {order.orderProducts.map((orderProduct) => (
          <OrderProductItem
            key={orderProduct.id}
            orderProduct={orderProduct}
            orderStatus={order.orderStatus}
            onCancelClick={onCancelClick}
          />
        ))}
      </div>
    </div>
  );
};

const BankTransferPendingAlert = () => {
  return (
    <div className="flex items-center gap-6 rounded-md border border-amber-200 bg-amber-100 p-4 text-sm text-amber-700">
      <Info className="size-6" strokeWidth={1.5} />
      <div className="flex flex-col gap-2">
        <span className="font-medium">입금이 완료되지 않은 주문이 있습니다.</span>
        <div className="flex items-center gap-8">
          <div className="flex flex-col gap-1">
            <span>예금주</span>
            <span className="font-bold">유안메디팜</span>
          </div>
          <div className="flex flex-col gap-1">
            <span>은행</span>
            <span className="font-bold">우리은행</span>
          </div>
          <div className="flex flex-col gap-1">
            <span>계좌번호</span>
            <span className="font-bold">1005-504-652055</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const OrderProductItem = ({
  orderProduct,
  orderStatus,
  onCancelClick,
}: {
  orderProduct: OrderProductItem;
  orderStatus: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
  onCancelClick: (orderProductId: number) => void;
}) => {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-bold">
        {orderProduct.orderProductStatus === ORDER_PRODUCT_STATUS.ORDERED
          ? ORDER_STATUS_NAME[orderStatus]
          : ORDER_PRODUCT_STATUS_NAME[orderProduct.orderProductStatus]}
      </span>
      <div className="flex w-full items-center gap-6">
        {/* 상품이미지 */}
        <div className="flex aspect-square w-[100px] shrink-0 items-center justify-center rounded-md border border-neutral-100 bg-neutral-50">
          {isPayloadImageRenderable(orderProduct.product.image) ? (
            <Image
              src={orderProduct.product.image.url}
              alt={'상품 이미지'}
              width={100}
              height={100}
              className="h-full w-full object-contain"
              unoptimized={true}
            />
          ) : (
            <ImageIcon className="text-foreground-300 h-6 w-6" strokeWidth={1.5} />
          )}
        </div>
        {/* 상품정보 */}
        <div className="flex shrink-0 flex-col justify-center text-[15px]">
          <span className="font-bold">{orderProduct.productNameSnapshot}</span>
          <div className="mt-4 flex items-center gap-10">
            <div className="flex flex-col text-sm">
              <span className="text-foreground-500">제조사</span>
              <span className="text-foreground-700 font-medium">
                {orderProduct.product.manufacturer}
              </span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-foreground-500">배송비</span>
              <span className="text-foreground-700 font-medium">
                {formatNumberWithCommas(orderProduct.productDeliveryFee)}원
              </span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-foreground-500">구매가격</span>
              <span className="text-foreground-700 font-medium">
                {formatNumberWithCommas(orderProduct.priceSnapshot)}원
              </span>
            </div>
            <div className="flex flex-col text-sm">
              <span className="text-foreground-500">수량</span>
              <span className="text-foreground-700 font-medium">{orderProduct.quantity}개</span>
            </div>
          </div>
        </div>
        {/* 주문 액션 */}
        <div className="flex w-full items-center justify-end">
          <Button
            size="sm"
            variant="destructive"
            className="cursor-pointer"
            onClick={() => onCancelClick(orderProduct.id)}
          >
            주문취소
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
