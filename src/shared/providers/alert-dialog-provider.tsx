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
import { AlertDialogConfig } from '../core';
import { Button } from '@/shared';
import { Spinner } from '@/shared/ui/shadcn/spinner';

interface AlertDialogContext {
  dialogConfig: AlertDialogConfig | null;
  setDialogConfig: React.Dispatch<React.SetStateAction<AlertDialogConfig | null>>;
  setActionDiabled: React.Dispatch<React.SetStateAction<boolean>>;
  onOpen: () => void;
  onClose: () => void;
}

export const alertDialogContext = createContext<AlertDialogContext | null>(null);

export const AlertDialogProvider = ({ children }: { children: React.ReactNode }) => {
  const [dialogConfig, setDialogConfig] = useState<AlertDialogConfig | null>(null);
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
