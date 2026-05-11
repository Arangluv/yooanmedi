'use client';

import React, { createContext, useContext, useState } from 'react';
import {
  AlertDialog as ShadcnAlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
} from '@/shared/ui/shadcn/alert-dialog';
import { DialogConfig } from '../../config/dialog.config';
import { Button } from '@/shared';
import { Spinner } from '@/shared/ui/shadcn/spinner';

interface AlertDialogContext {
  dialogConfig: DialogConfig | null;
  setDialogConfig: React.Dispatch<React.SetStateAction<DialogConfig | null>>;
  setActionDiabled: React.Dispatch<React.SetStateAction<boolean>>;
  onOpen: () => void;
  onClose: () => void;
}

const alertDialogContext = createContext<AlertDialogContext | null>(null);

const useAlertDialog = () => {
  const alertContext = useContext(alertDialogContext);

  if (!alertContext) {
    throw new Error('useAlertDialog는 AlertDialogProvider 내부에서만 사용할 수 있습니다.');
  }

  return alertContext;
};

const AlertDialog = ({ children }: { children: React.ReactNode }) => {
  const [dialogConfig, setDialogConfig] = useState<DialogConfig | null>(null);
  const [_actionDiabled, setActionDiabled] = useState(false);
  const [_open, setOpen] = useState(false);

  return (
    <alertDialogContext.Provider
      value={{
        dialogConfig,
        setDialogConfig,
        setActionDiabled,
        onOpen: () => setOpen(true),
        onClose: () => setOpen(false),
      }}
    >
      <ShadcnAlertDialog open={_open}>
        <AlertDialogContent
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogConfig?.headerTitle}</AlertDialogTitle>
            <AlertDialogDescription>{dialogConfig?.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setOpen(false)}>닫기</AlertDialogCancel>
            <Button disabled={_actionDiabled} onClick={dialogConfig?.action.onClick}>
              {dialogConfig?.action.text}
              {_actionDiabled && <Spinner />}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
        {children}
      </ShadcnAlertDialog>
    </alertDialogContext.Provider>
  );
};

export { AlertDialog, useAlertDialog };
