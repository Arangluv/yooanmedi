'use client';

import { AlertDialog } from '@/shared/ui/shadcn/alert-dialog';
import { createContext, useContext, useMemo, useState } from 'react';

type DialogContextProps = {
  onOpen: () => void;
  onClose: () => void;
  content: {
    title: string;
    description: string;
    confirmText: string;
  };
  setContent: (content: { title: string; description: string; confirmText: string }) => void;
};

const DialogContext = createContext<DialogContextProps | null>(null);

const useOrderListDialog = () => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog는 DialogProvider 내에서만 사용할 수 있습니다.');
  }

  return context;
};

const OrderListDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [_open, setOpen] = useState(false);
  const [content, setContent] = useState<DialogContextProps['content']>({
    title: '',
    description: '',
    confirmText: '',
  });

  const onOpen = () => setOpen(true);
  const onClose = () => setOpen(false);

  const value = useMemo(
    () => ({ onOpen, onClose, content, setContent }),
    [onOpen, onClose, content, setContent],
  );

  return (
    <AlertDialog open={_open} onOpenChange={setOpen}>
      <DialogContext.Provider value={value}>{children}</DialogContext.Provider>
    </AlertDialog>
  );
};

export { useOrderListDialog, OrderListDialogProvider };
