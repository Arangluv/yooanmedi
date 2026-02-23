'use client';

import { useOrderAlertDialog } from '../model/dialog-provider';
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/ui/shadcn/alert-dialog';

const OrderAlertDialogContent = () => {
  const { content, onConfirm } = useOrderAlertDialog();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{content.title}</AlertDialogTitle>
        <AlertDialogDescription className="text-base">{content.description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>취소</AlertDialogCancel>
        <AlertDialogAction onClick={async () => await onConfirm()}>
          {content.confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default OrderAlertDialogContent;
