'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { OrderAction } from '@/entities/order/constants/order-action';
import { OrderStatus } from '@/entities/order/constants/order-status';

import { cancelSingleOrder, cancelMultipleOrder } from '../api/cancel-order';
import { ExecuteActionResult } from './types';

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

const useCancelActionExecute = () => {
  const [isLoading, setIsLoading] = useState(false);

  const executeSingle = async ({
    action,
    currentStatus,
    orderId,
  }: ExecuteSingleParams): Promise<ExecuteActionResult> => {
    try {
      setIsLoading(true);

      const result = await cancelSingleOrder({ action, currentStatus, targetOrderId: orderId });
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

      const result = await cancelMultipleOrder({ action, currentStatus, targetOrderIds: orderIds });
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

  return {
    executeSingle,
    executeMultiple,
    isLoading,
  };
};

export default useCancelActionExecute;
