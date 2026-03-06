'use client';

import { OrderAction } from '@/entities/order/constants/order-action';
import { OrderStatus } from '@/entities/order/constants/order-status';
import { useState } from 'react';
import { ExecuteActionResult } from './types';
import { cancelOrders, cancelOrderProduct } from '../../order-cancel/api/cancel-order';

interface ExecuteSingleParams {
  action: OrderAction;
  currentStatus: OrderStatus;
  orderId: number;
}

interface ExecuteCancelOrdersParams {
  action: OrderAction;
  currentStatus: OrderStatus;
  orderIds: number[];
}

interface ExecuteCancelOrderProductParams {
  action: OrderAction;
  currentStatus: OrderStatus;
  orderId: number;
  orderProductId: number;
}

const useCancelActionExecute = () => {
  const [isLoading, setIsLoading] = useState(false);

  // const executeSingle = async ({
  //   action,
  //   currentStatus,
  //   orderId,
  // }: ExecuteSingleParams): Promise<ExecuteActionResult> => {
  //   try {
  //     setIsLoading(true);

  //     const result = await cancelSingleOrder({ action, currentStatus, targetOrderId: orderId });

  //     return result;
  //   } catch (error) {
  //     const errorMessage =
  //       error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
  //     return {
  //       success: false,
  //       message: errorMessage,
  //     };
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const executeCancelOrders = async ({
    action,
    currentStatus,
    orderIds,
  }: ExecuteCancelOrdersParams): Promise<ExecuteActionResult> => {
    try {
      setIsLoading(true);

      const result = await cancelOrders({ action, currentStatus, targetOrderIds: orderIds });

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

  const executeCancelOrderProduct = async ({
    action,
    currentStatus,
    orderId,
    orderProductId,
  }: ExecuteCancelOrderProductParams): Promise<ExecuteActionResult> => {
    try {
      setIsLoading(true);

      const result = await cancelOrderProduct({
        action,
        currentStatus,
        targetOrderId: orderId,
        orderProductId,
      });

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
    executeCancelOrders,
    executeCancelOrderProduct,
    isLoading,
  };
};

export default useCancelActionExecute;
