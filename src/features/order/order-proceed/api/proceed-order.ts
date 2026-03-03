'use server';

import { OrderAction } from '@/entities/order/constants/order-action';
import { OrderStatus } from '@/entities/order/constants/order-status';
import { OrderStateMachine } from '@/entities/order/model/order-state-machine';
import { ProceedCommandFactory } from '../../order-proceed/model/proceed-command-factory';
import { ExecuteActionResult } from '../model/types';

// 딱 한개의 order status만 바꾸는 함수
export const proceedSingleOrder = async (
  action: OrderAction | null,
  currentStatus: OrderStatus | null,
  targetOrderId: number,
): Promise<ExecuteActionResult> => {
  try {
    if (!action || !currentStatus || !targetOrderId) {
      return {
        success: false,
        message: '[proceedOrder] 필수 파라미터가 누락되었습니다',
      };
    }

    const orderStatusMachine = new OrderStateMachine(currentStatus as OrderStatus);
    if (!orderStatusMachine.canExecuteAction(action as OrderAction)) {
      return {
        success: false,
        message: '[orderStatusMachine] 해당 상태에서는 해당 액션을 수행할 수 없습니다',
      };
    }

    const command = ProceedCommandFactory.createCommand(currentStatus as OrderStatus);
    const result = await command.execute(targetOrderId);

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';

    return {
      success: false,
      message: errorMessage,
    };
  }
};

export const proceedMultipleOrder = async (
  action: OrderAction | null,
  currentStatus: OrderStatus | null,
  targetOrderIds: number[],
): Promise<ExecuteActionResult> => {
  if (!action || !currentStatus || !targetOrderIds) {
    return {
      success: false,
      message: '[proceedMultipleOrder] 필수 파라미터가 누락되었습니다',
    };
  }

  const orderStatusMachine = new OrderStateMachine(currentStatus as OrderStatus);
  if (!orderStatusMachine.canExecuteAction(action as OrderAction)) {
    return {
      success: false,
      message: '[orderStatusMachine] 해당 상태에서는 해당 액션을 수행할 수 없습니다',
    };
  }
  console.log('[Server Action] target order ids');
  console.log(targetOrderIds);

  const command = ProceedCommandFactory.createCommand(currentStatus as OrderStatus);
  const results = await Promise.allSettled(
    targetOrderIds.map(async (targetOrderId) => {
      const commandResult = await command.execute(targetOrderId);
      console.log('[Server Action] commandResult');
      console.log(commandResult);

      if (!commandResult.success) {
        return Promise.reject(commandResult.message);
      }
    }),
  );

  const successCount = results.filter((result) => result.status === 'fulfilled').length;
  const failCount = results.length - successCount;

  if (failCount > 0) {
    return {
      success: false,
      message: `주문 진행 중 오류가 발생했습니다 (${failCount}건)`,
    };
  }

  return {
    success: true,
    message: `주문 진행이 완료되었습니다 (${successCount}건)`,
  };
};
