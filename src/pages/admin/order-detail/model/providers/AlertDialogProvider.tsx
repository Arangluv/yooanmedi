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

interface AlertDialogContext {
  dialogConfig: DialogConfig | null;
  setDialogConfig: React.Dispatch<React.SetStateAction<DialogConfig | null>>;
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

  return (
    <alertDialogContext.Provider value={{ dialogConfig, setDialogConfig }}>
      <ShadcnAlertDialog>
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
            <AlertDialogCancel>닫기</AlertDialogCancel>
            {/* 아래 부분을 외부에서 주입하는 방법은 없는가? */}
            <Button onClick={dialogConfig?.action.onClick}>{dialogConfig?.action.text}</Button>
          </AlertDialogFooter>
        </AlertDialogContent>
        {children}
      </ShadcnAlertDialog>
    </alertDialogContext.Provider>
  );
};

export { AlertDialog, useAlertDialog };
