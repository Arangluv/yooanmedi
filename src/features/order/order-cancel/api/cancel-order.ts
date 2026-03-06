'use server';

import { OrderAction } from '@/entities/order/constants/order-action';
import { OrderStatus } from '@/entities/order/constants/order-status';

import { ExecuteActionResult } from '../model/types';
import { OrderStateMachine } from '@/entities/order/model/order-state-machine';
import { CancelCommandFactory } from '../model/cancel-command-factory';

// export const cancelSingleOrder = async ({
//   action,
//   currentStatus,
//   targetOrderId,
// }: {
//   action: OrderAction;
//   currentStatus: OrderStatus;
//   targetOrderId: number;
// }): Promise<ExecuteActionResult> => {
//   try {
//     const orderStatusMachine = new OrderStateMachine(currentStatus as OrderStatus);
//     if (!orderStatusMachine.canExecuteAction(action as OrderAction)) {
//       return {
//         success: false,
//         message: '[orderStatusMachine] 해당 상태에서는 해당 액션을 수행할 수 없습니다',
//       };
//     }

//     const command = CancelCommandFactory.createCommand(currentStatus, action);
//     const result = await command.totalCancelExecute(targetOrderId);

//     return result;
//   } catch (error) {
//     const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

//     return {
//       success: false,
//       message: errorMessage,
//     };
//   }
// };

export const cancelOrders = async ({
  action,
  currentStatus,
  targetOrderIds,
}: {
  action: OrderAction;
  currentStatus: OrderStatus;
  targetOrderIds: number[];
}) => {
  try {
    const orderStatusMachine = new OrderStateMachine(currentStatus as OrderStatus);
    if (!orderStatusMachine.canExecuteAction(action as OrderAction)) {
      return {
        success: false,
        message: '[orderStatusMachine] 해당 상태에서는 해당 액션을 수행할 수 없습니다',
      };
    }

    const command = CancelCommandFactory.createCommand(currentStatus, action);
    const results = await Promise.allSettled(
      targetOrderIds.map(async (targetOrderId) => {
        const result = await command.totalCancelExecute(targetOrderId);
        if (!result.success) {
          return Promise.reject(result.message);
        }
      }),
    );

    const successCount = results.filter((result) => result.status === 'fulfilled').length;
    const failCount = results.length - successCount;

    if (failCount > 0) {
      return {
        success: false,
        message: `주문 취소 중 오류가 발생했습니다 (${failCount}건)`,
      };
    }

    return {
      success: true,
      message: `주문 취소가 완료되었습니다 (${successCount}건)`,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const cancelOrderProduct = async ({
  action,
  currentStatus,
  targetOrderId,
  orderProductId,
}: {
  action: OrderAction;
  currentStatus: OrderStatus;
  targetOrderId: number;
  orderProductId: number;
}) => {
  try {
    const orderStatusMachine = new OrderStateMachine(currentStatus as OrderStatus);
    if (!orderStatusMachine.canExecuteAction(action as OrderAction)) {
      return {
        success: false,
        message: '[orderStatusMachine] 해당 상태에서는 해당 액션을 수행할 수 없습니다',
      };
    }

    const command = CancelCommandFactory.createCommand(currentStatus, action);
    const result = await command.partialCancelExecute(targetOrderId, orderProductId);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
    return {
      success: false,
      message: errorMessage,
    };
  }
};
