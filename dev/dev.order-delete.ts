'use server';

import { getPayload } from '@/shared/infrastructure';
import { FindOption, PAYMENTS_METHOD } from '@/shared';

export const deleteOrderAll = async (targetUserId: number) => {
  // try {
  //   const payload = await getPayload();
  //   const orderService = new OrderService();
  //   const options = {
  //     pagination: false,
  //     where: {
  //       user: {
  //         equals: targetUserId,
  //       },
  //     },
  //   } as FindOption;
  //   const { orders } = await orderService.getOrderList(options);
  //   const orderIds = orders.map((order) => order.id);
  //   const allOrderProductIds = orders.map((order) => order.orderProducts).flat();
  //   const ordersByCreditCardIds = orders
  //     .filter((order) => order.paymentsMethod === PAYMENTS_METHOD.credit_card)
  //     .map((order) => order.id);
  //   const { docs: paymentHistory } = await payload.find({
  //     collection: 'payment',
  //     where: {
  //       order: {
  //         in: ordersByCreditCardIds,
  //       },
  //     },
  //     pagination: false,
  //     depth: 0,
  //   });
  //   const paymentHistoryIds = paymentHistory.map((item) => item.id);
  //   const { docs: pointTransactionHistory } = await payload.find({
  //     collection: 'point-transaction',
  //     where: {
  //       user: {
  //         equals: targetUserId,
  //       },
  //     },
  //     pagination: false,
  //     depth: 0,
  //   });
  //   const pointTransactionHistoryIds = pointTransactionHistory.map((item) => item.id);
  //   const { docs: recentPuchasedItem } = await payload.find({
  //     collection: 'recent-purchased-history',
  //     depth: 0,
  //     pagination: false,
  //     where: {
  //       user: {
  //         equals: targetUserId,
  //       },
  //     },
  //   });
  //   const recentPuchasedItemIds = recentPuchasedItem.map((item) => item.id);
  //   // 최근 구매상품 삭제
  //   await payload.delete({
  //     collection: 'recent-purchased-history',
  //     where: {
  //       id: {
  //         in: recentPuchasedItemIds,
  //       },
  //     },
  //   });
  //   // 포인트 적립 내역 삭제
  //   await payload.delete({
  //     collection: 'point-transaction',
  //     where: {
  //       id: {
  //         in: pointTransactionHistoryIds,
  //       },
  //     },
  //   });
  //   // 결제 히스토리 삭제
  //   await payload.delete({
  //     collection: 'payment',
  //     where: {
  //       id: {
  //         in: paymentHistoryIds,
  //       },
  //     },
  //   });
  //   // 주문상품 삭제
  //   await payload.delete({
  //     collection: 'order-product',
  //     where: {
  //       id: {
  //         in: allOrderProductIds,
  //       },
  //     },
  //   });
  //   // 주문삭제
  //   await payload.delete({
  //     collection: 'order',
  //     where: {
  //       id: {
  //         in: orderIds,
  //       },
  //     },
  //   });
  //   return {
  //     isSuccess: true,
  //   };
  // } catch (erorr) {
  //   return {
  //     isSuccess: false,
  //   };
  // }
};
