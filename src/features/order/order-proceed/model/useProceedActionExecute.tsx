'use client';

import { useState } from 'react';
import { OrderStatus } from '@/entities/order/constants/order-status';
import { OrderAction } from '@/entities/order/constants/order-action';
import { ExecuteActionResult } from '../../order-proceed/model/types';
import { proceedSingleOrder, proceedMultipleOrder } from '../api/proceed-order';

interface ExecuteSingleParams {
  action: OrderAction;
  currentStatus: OrderStatus;
  orderId: number;
}

interface ExecuteMultipleParams {
  action: OrderAction;
  currentStatus: OrderStatus;
  orderIds: number[];
}

const useProceedActionExecute = () => {
  const [isLoading, setIsLoading] = useState(false);

  const executeSingle = async ({
    action,
    currentStatus,
    orderId,
  }: ExecuteSingleParams): Promise<ExecuteActionResult> => {
    try {
      const result = await proceedSingleOrder(action, currentStatus, orderId);
      return result;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
      return {
        success: false,
        message: errorMessage,
      };
    } finally {
      setIsLoading(false);
    }
  };

  const executeMultiple = async ({
    action,
    currentStatus,
    orderIds,
  }: ExecuteMultipleParams): Promise<ExecuteActionResult> => {
    try {
      setIsLoading(true);

      const result = await proceedMultipleOrder(action, currentStatus, orderIds);
      return result;
    } catch (error) {
      return {
        success: false,
        message: '주문 진행 중 오류가 발생했습니다',
      };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    executeSingle,
    executeMultiple,
    isLoading,
  };
};

export default useProceedActionExecute;
