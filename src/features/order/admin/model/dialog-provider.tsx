'use client';

import { AlertDialog } from '@/shared/ui/shadcn/alert-dialog';
import { createContext, useContext, useMemo, useState } from 'react';

type OrderAlertDialogContextProps = {
  content: {
    title: string;
    description: string;
    confirmText: string;
  };
  setContent: (content: { title: string; description: string; confirmText: string }) => void;
  setOnConfirm: (onConfirm: () => Promise<void>) => void;
  onConfirm: () => Promise<void>;
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
  const [content, setContent] = useState<OrderAlertDialogContextProps['content']>({
    title: '',
    description: '',
    confirmText: '',
  });
  const [onConfirm, setOnConfirm] = useState<() => Promise<void>>(async () => {});

  const value = useMemo(
    () => ({
      content,
      setContent,
      onConfirm,
      setOnConfirm,
    }),
    [content, onConfirm, setContent, setOnConfirm],
  );

  return (
    <AlertDialog>
      <OrderAlertDialogContext.Provider value={value}>{children}</OrderAlertDialogContext.Provider>
    </AlertDialog>
  );
};

export default AlertDialogProvider;
