// 'use client';

// import { useState } from 'react';
// import { toast } from 'sonner';

// import {
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from '@/shared/ui/shadcn/alert-dialog';
// import { Spinner } from '@/shared/ui/shadcn/spinner';

// import { useOrderAlertDialog } from '../model/dialog-provider';
// import { getStatusScenario, statusUpdateScenario } from '../lib/status-scenario';
// import { useQueryClient } from '@tanstack/react-query';

// const OrderAlertDialogContent = () => {
//   const { content, targetOrder, onClose } = useOrderAlertDialog();
//   const [isLoading, setIsLoading] = useState(false);
//   const queryClient = useQueryClient();

//   if (!targetOrder) {
//     return null;
//   }

//   return (
//     <AlertDialogContent>
//       <AlertDialogHeader>
//         <AlertDialogTitle>{content.title}</AlertDialogTitle>
//         <AlertDialogDescription className="text-base">{content.description}</AlertDialogDescription>
//       </AlertDialogHeader>
//       <AlertDialogFooter>
//         <AlertDialogCancel disabled={isLoading}>취소</AlertDialogCancel>
//         <AlertDialogAction
//           disabled={isLoading}
//           onClick={async (e) => {
//             e.stopPropagation();
//             e.preventDefault();

//             try {
//               setIsLoading(true);
//               const updateActionScenario = getStatusScenario(targetOrder.status);
//               await statusUpdateScenario[updateActionScenario]({
//                 orderStatus: targetOrder.status,
//                 orderId: targetOrder.id,
//               });

//               toast.success('주문 상태가 변경되었습니다');
//               queryClient.invalidateQueries({ queryKey: ['order', targetOrder.id] });
//             } catch (error) {
//               const errorMessage =
//                 error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

//               toast.error(errorMessage);
//             } finally {
//               setIsLoading(false);
//               onClose();
//             }
//           }}
//         >
//           {isLoading && <Spinner className="size-4" />}
//           {content.confirmText}
//         </AlertDialogAction>
//       </AlertDialogFooter>
//     </AlertDialogContent>
//   );
// };

// export default OrderAlertDialogContent;
