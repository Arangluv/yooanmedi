'use client';

import { createContext, useContext, useState } from 'react';
import {
  ActionUiConfig,
  CANCEL_ACTION_UI_CONFIG,
  PROCEED_ACTION_UI_CONFIG,
} from '@/entities/order/config/action-ui-config';
import { OrderStatus } from '@/entities/order/constants/order-status';

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
import { Button } from '@/shared/ui/shadcn/button';
import { Spinner } from '@/shared/ui/shadcn/spinner';
import { toast } from 'sonner';
// import { OrderAction } from '@/entities/order/constants/order-action';

interface OrderActionDialogContextValue {
  open: boolean;
  dialogConfig: ActionUiConfig | null;
  targetOrderIds: number[];
  setTargetOrderIds: (targetOrderIds: number[]) => void;
  actionType: DialogActionType | null;
  currentStatus: OrderStatus | null;
  setCurrentStatus: (status: OrderStatus) => void;
  display: Display | null;
  setDisplay: (display: Display) => void;
  onOpen: (config: ActionUiConfig, type: DialogActionType) => void;
  onClose: () => void;
}

type DialogActionType = 'proceed' | 'cancel';

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
  const [actionType, setActionType] = useState<DialogActionType | null>(null);
  const [targetOrderIds, setTargetOrderIds] = useState<number[]>([]);
  const [currentStatus, setCurrentStatus] = useState<OrderStatus | null>(null);
  const [display, setDisplay] = useState<Display | null>(null);

  const onOpen = (config: ActionUiConfig, type: DialogActionType) => {
    setDialogConfig(config);
    setActionType(type);
    _setOpen(true);
  };

  const onClose = () => {
    setDialogConfig(null);
    setActionType(null);
    _setOpen(false);
  };

  return (
    <OrderActionDialogContext.Provider
      value={{
        open,
        dialogConfig,
        targetOrderIds,
        setTargetOrderIds,
        actionType,
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
interface OrderActionDialogTriggerProps {
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
}: OrderActionDialogTriggerProps) {
  const { onOpen, setCurrentStatus, setTargetOrderIds, setDisplay } = useOrderActionDialog();
  const uiConfig = PROCEED_ACTION_UI_CONFIG[currentStatus];

  if (!uiConfig) return null;

  const handleTriggerClick = () => {
    setTargetOrderIds(targetOrderIds);
    setCurrentStatus(currentStatus);
    setDisplay(display);
    onOpen({ ...uiConfig }, 'proceed');
  };

  if (children) {
    return <div onClick={handleTriggerClick}>{children}</div>;
  }

  return <Button onClick={handleTriggerClick}>{uiConfig.buttonText}</Button>;
};

// 주문취소 Dialog Trigger
OrderAction.CancelTrigger = function CancelTrigger({
  targetOrderIds,
  currentStatus,
  display,
  children,
}: OrderActionDialogTriggerProps) {
  const { onOpen, setCurrentStatus, setTargetOrderIds, setDisplay } = useOrderActionDialog();
  const uiConfig = CANCEL_ACTION_UI_CONFIG[currentStatus];

  if (!uiConfig) return null;

  const handleTriggerClick = () => {
    setTargetOrderIds(targetOrderIds);
    setCurrentStatus(currentStatus);
    setDisplay(display);
    onOpen({ ...uiConfig }, 'cancel');
  };

  if (children) {
    return <div onClick={handleTriggerClick}>{children}</div>;
  }

  return <Button onClick={handleTriggerClick}>{uiConfig.buttonText}</Button>;
};

// Content (Dialog 내용)
OrderAction.ProceedContent = function ProceedContent() {
  const [isLoading, setIsLoading] = useState(false);
  const { dialogConfig, actionType, currentStatus, targetOrderIds, display, onClose } =
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
              toast.success('진행 액션이 들어갑니다');
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

OrderAction.CancelContent = function CancelContent() {
  const [isLoading, setIsLoading] = useState(false);
  const { dialogConfig, actionType, currentStatus, targetOrderIds, display, onClose } =
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
