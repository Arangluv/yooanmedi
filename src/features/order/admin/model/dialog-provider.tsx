'use client';

import { AlertDialog } from '@/shared/ui/shadcn/alert-dialog';
import { createContext, useContext, useMemo, useState } from 'react';
import { OrderStatus } from '@/entities/order/constants/order-status';

type OrderAlertDialogContextProps = {
  content: {
    title: string;
    description: string;
    confirmText: string;
  };
  setContent: (content: { title: string; description: string; confirmText: string }) => void;
  targetOrder: {
    status: OrderStatus;
    id: number;
  } | null;
  setTargetOrder: (order: { status: OrderStatus; id: number }) => void;
  open: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const OrderAlertDialogContext = createContext<OrderAlertDialogContextProps | null>(null);

export const useOrderAlertDialog = () => {
  const context = useContext(OrderAlertDialogContext);

  if (!context) {
    throw new Error('useOrderAlertDialog는 OrderAlertDialogProvider 내에서만 사용할 수 있습니다.');
  }

  return context;
};

const AlertDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [open, setOpen] = useState(false);
  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const [content, setContent] = useState<OrderAlertDialogContextProps['content']>({
    title: '',
    description: '',
    confirmText: '',
  });
  const [targetOrder, setTargetOrder] = useState<{ status: OrderStatus; id: number } | null>(null);

  const value = useMemo(
    () => ({
      content,
      setContent,
      targetOrder,
      setTargetOrder,
      open,
      onOpen,
      onClose,
    }),
    [content, targetOrder, setContent, setTargetOrder, open, onOpen, onClose],
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <OrderAlertDialogContext.Provider value={value}>{children}</OrderAlertDialogContext.Provider>
    </AlertDialog>
  );
};

export default AlertDialogProvider;
