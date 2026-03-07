// 'use client';

// import { Fragment } from 'react';
// import moment from 'moment';

// import OrderStatusBadge from '@/entities/order/ui/admin/badge';
// import { useOrderCollection } from '../model/order-provider';
// import { ORDER_STATUS, PAYMENTS_METHOD } from '@/entities/order';
// import { ORDER_ACTION } from '@/entities/order/constants/order-action';
// import EmptyOrderInfo from '@/entities/order/ui/admin/EmptyOrderInfo';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardDescription,
//   CardContent,
//   CardFooter,
// } from '@/shared/ui/shadcn/card';
// import { ItemGroup, ItemSeparator } from '@/shared/ui/shadcn/item';

// import OrderProductItem from './OrderProductItem';
// import { OrderAction } from '../model/order-action-dialog-provider';
// import { ORDER_DETAIL_UI_CONFIG, OrderInfomationCardType } from '../config/order-detail-ui-config';

// interface OrderInfoCardProps {
//   type: OrderInfomationCardType;
//   children?: React.ReactNode;
// }

// const OrderInfoCard = ({ type }: OrderInfoCardProps) => {
//   const uiConfig = ORDER_DETAIL_UI_CONFIG[type];

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center justify-between text-xl">
//           <span>{uiConfig.title}</span>
//           {orderInfo?.progressOrder?.orderStatus && (
//             <OrderStatusBadge orderStatus={orderInfo.progressOrder.orderStatus} />
//           )}
//         </CardTitle>
//         <CardDescription className="flex flex-row gap-2 text-lg">
//           <span>#{orderInfo?.progressOrder?.orderNo}</span>•
//           <span>{moment(orderInfo?.progressOrder?.date).format('YYYY-MM-DD HH:mm:ss')} 생성</span>
//         </CardDescription>
//       </CardHeader>
//       <CardContent>
//         <ItemGroup>
//           {isEmpty ? (
//             <EmptyOrderInfo title="주문 정보가 없습니다." />
//           ) : (
//             orderInfo?.progressOrder?.orderProducts.map((orderProduct, idx) => {
//               return (
//                 <Fragment key={orderProduct.id}>
//                   <OrderProductItem
//                     orderId={orderInfo.progressOrder.id}
//                     idx={idx}
//                     orderProduct={orderProduct}
//                     isCancelAction={true}
//                   />
//                   <ItemSeparator />
//                 </Fragment>
//               );
//             })
//           )}
//         </ItemGroup>
//       </CardContent>
//       {isEmpty ? null : (
//         <CardFooter className="justify-end">
//           {orderInfo?.progressOrder?.orderStatus && (
//             <Fragment>
//               <OrderAction.ProceedTrigger
//                 display={{
//                   count: orderInfo.progressOrder.orderProducts.length,
//                   viewType: 'order-detail',
//                 }}
//                 targetOrderIds={[orderInfo.progressOrder.id]}
//                 currentStatus={orderInfo.progressOrder.orderStatus}
//               />
//               <OrderAction.ProceedContent />
//             </Fragment>
//           )}
//         </CardFooter>
//       )}
//     </Card>
//   );
// };

// export const OrderProgressInfoCard = () => {
//   return (
//     <OrderInfoCard type="progress">
//       {/* <CardFooter className="justify-end">
//         <OrderAction.ProceedTrigger
//           display={{
//             count: orderInfo.progressOrder.orderProducts.length,
//             viewType: 'order-detail',
//           }}
//           targetOrderIds={[orderInfo.progressOrder.id]}
//           currentStatus={orderInfo.progressOrder.orderStatus}
//         />
//         <OrderAction.ProceedContent />
//       </CardFooter> */}
//     </OrderInfoCard>
//   );
// };

// export const OrderCancelRequestInfoCard = () => {
//   return (
//     <OrderInfoCard type="cancelRequest">
//       {/* <CardFooter className="justify-end">
//         <OrderAction.CancelTrigger
//           display={{
//             count: orderInfo?.cancelRequestOrder?.orderProducts.length ?? 0,
//             viewType: 'order-detail',
//           }}
//           targetOrderIds={[orderInfo?.cancelRequestOrder?.id ?? 0]}
//           currentStatus={ORDER_STATUS.CANCEL_REQUEST}
//         />
//         <OrderAction.CancelContent />
//       </CardFooter> */}
//     </OrderInfoCard>
//   );
// };

// export const OrderCancelledInfoCard = () => {
//   return <OrderInfoCard type="cancelled" />;
// };
