'use client';

import { createContext, useContext, useState } from 'react';
import { toast } from 'sonner';

import useProceedActionExecute from '@/features/order/order-proceed/model/useProceedActionExecute'; // todo: 잘못된 참조방식
import {
  ActionUiConfig,
  CANCEL_ACTION_UI_CONFIG,
  PROCEED_ACTION_UI_CONFIG,
} from '@/entities/order/config/action-ui-config';
import { OrderStatus } from '@/entities/order/constants/order-status';

import { Button } from '@/shared/ui/shadcn/button';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import {
  ORDER_ACTION,
  type OrderAction as OrderActionType,
} from '@/entities/order/constants/order-action';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/shared/ui/shadcn/alert-dialog';
import { ExecuteActionResult } from '../../order-proceed/model/types';
import { useQueryClient } from '@tanstack/react-query';

interface OrderActionDialogContextValue {
  open: boolean;
  dialogConfig: ActionUiConfig | null;
  targetOrderIds: number[];
  setTargetOrderIds: (targetOrderIds: number[]) => void;
  action: OrderActionType | null;
  currentStatus: OrderStatus | null;
  setCurrentStatus: (status: OrderStatus) => void;
  display: Display | null;
  setDisplay: (display: Display) => void;
  onOpen: (config: ActionUiConfig, action: OrderActionType) => void;
  onClose: () => void;
}

type Display = {
  count: number;
  viewType: 'order-list' | 'order-detail';
};
const OrderActionDialogContext = createContext<OrderActionDialogContextValue | null>(null);

const useOrderActionDialog = () => {
  const context = useContext(OrderActionDialogContext);

  if (!context) {
    throw new Error(
      'useOrderActionDialog는 OrderActionDialogProvider 내에서만 사용할 수 있습니다.',
    );
  }

  return context;
};

interface OrderActionDialogProviderProps {
  children: React.ReactNode;
}

export const OrderAction = ({ children }: OrderActionDialogProviderProps) => {
  const [open, _setOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState<ActionUiConfig | null>(null);
  const [action, setAction] = useState<OrderActionType | null>(null);
  const [targetOrderIds, setTargetOrderIds] = useState<number[]>([]);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  const [display, setDisplay] = useState<Display | null>(null);

  const onOpen = (config: ActionUiConfig, action: OrderActionType) => {
    setDialogConfig(config);
    setAction(action);
    _setOpen(true);
  };

  const onClose = () => {
    setDialogConfig(null);
    setAction(null);
    _setOpen(false);
  };

  return (
    <OrderActionDialogContext.Provider
      value={{
        open,
        dialogConfig,
        targetOrderIds,
        setTargetOrderIds,
        action,
        currentStatus,
        setCurrentStatus,
        display,
        setDisplay,
        onOpen,
        onClose,
      }}
    >
      <AlertDialog open={open} onOpenChange={onClose}>
        {children}
      </AlertDialog>
    </OrderActionDialogContext.Provider>
  );
};

// Dialog Open & Close Trigger
interface ProceedActionDialogTriggerProps {
  targetOrderIds: number[];
  currentStatus: OrderStatus;
  display: Display;
  children?: React.ReactNode;
}

// 주문진행 Dialog Trigger
OrderAction.ProceedTrigger = function ProceedTrigger({
  targetOrderIds,
  currentStatus,
  display,
  children,
}: ProceedActionDialogTriggerProps) {
  const { onOpen, setCurrentStatus, setTargetOrderIds, setDisplay } = useOrderActionDialog();
  const uiConfig = PROCEED_ACTION_UI_CONFIG[currentStatus];

  if (!uiConfig) return null;

  const handleTriggerClick = () => {
    setTargetOrderIds(targetOrderIds);
    setCurrentStatus(currentStatus);
    setDisplay(display);
    onOpen({ ...uiConfig }, ORDER_ACTION.PROCEED);
  };

  if (children) {
    return <div onClick={handleTriggerClick}>{children}</div>;
  }

  return <Button onClick={handleTriggerClick}>{uiConfig.buttonText}</Button>;
};

// Dialog Open & Close Trigger
interface CancelActionDialogTriggerProps {
  targetOrderIds: number[];
  currentStatus: OrderStatus;
  display: Display;
  action: OrderActionType;
  children?: React.ReactNode;
}

// 주문취소 Dialog Trigger
OrderAction.CancelTrigger = function CancelTrigger({
  targetOrderIds,
  currentStatus,
  display,
  action,
  children,
}: CancelActionDialogTriggerProps) {
  const { onOpen, setCurrentStatus, setTargetOrderIds, setDisplay } = useOrderActionDialog();
  const uiConfig = CANCEL_ACTION_UI_CONFIG[currentStatus];

  if (!uiConfig) return null;

  const handleTriggerClick = () => {
    setTargetOrderIds(targetOrderIds);
    setCurrentStatus(currentStatus);
    setDisplay(display);
    onOpen({ ...uiConfig }, action);
  };

  if (children) {
    return <div onClick={handleTriggerClick}>{children}</div>;
  }

  return <Button onClick={handleTriggerClick}>{uiConfig.buttonText}</Button>;
};

// Content (Dialog 내용)
OrderAction.ProceedContent = function ProceedContent() {
  const queryClient = useQueryClient();
  const { executeSingle, executeMultiple, isLoading } = useProceedActionExecute();
  const { dialogConfig, action, currentStatus, targetOrderIds, display, onClose } =
    useOrderActionDialog();

  if (!dialogConfig || !display || !action || !currentStatus) return null;

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {dialogConfig.dialogTitle({ count: display.count, viewType: display.viewType })}
        </AlertDialogTitle>
        <AlertDialogDescription>{dialogConfig.dialogDescription}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>취소</AlertDialogCancel>
        <AlertDialogAction
          disabled={isLoading}
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            try {
              let result: ExecuteActionResult;
              if (targetOrderIds.length === 1) {
                result = await executeSingle({ action, currentStatus, orderId: targetOrderIds[0] });
              } else {
                result = await executeMultiple({ action, currentStatus, orderIds: targetOrderIds });
              }

              if (!result.success) {
                toast.error(result.message);
                return;
              }

              toast.success(result.message);

              if (targetOrderIds.length === 1) {
                queryClient.invalidateQueries({ queryKey: ['order'] });
              } else {
                queryClient.invalidateQueries({ queryKey: ['orders'] });
              }
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
              toast.error(errorMessage);
            } finally {
              onClose();
            }
          }}
        >
          {isLoading && <Spinner className="size-4" />}
          {dialogConfig.dialogConfirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

OrderAction.CancelContent = function CancelContent() {
  const [isLoading, setIsLoading] = useState(false);
  const { dialogConfig, action, currentStatus, targetOrderIds, display, onClose } =
    useOrderActionDialog();

  if (!dialogConfig || !display) return null;

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>
          {dialogConfig.dialogTitle({ count: display.count, viewType: display.viewType })}
        </AlertDialogTitle>
        <AlertDialogDescription>{dialogConfig.dialogDescription}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel disabled={isLoading}>취소</AlertDialogCancel>
        <AlertDialogAction
          disabled={isLoading}
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();

            try {
              setIsLoading(true);
              // 3초 대기 테스트
              await new Promise((resolve) => setTimeout(resolve, 3000));
              toast.success('취소 액션이 들어갑니다');
            } catch (error) {
              const errorMessage =
                error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다';
              toast.error(errorMessage);
            } finally {
              setIsLoading(false);
              onClose();
            }
          }}
        >
          {isLoading && <Spinner className="size-4" />}
          {dialogConfig.dialogConfirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};
