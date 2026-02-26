'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogCancel,
  AlertDialogAction,
  AlertDialogFooter,
} from '@/shared/ui/shadcn/alert-dialog';
import { Spinner } from '@/shared/ui/shadcn/spinner';

import { useOrderListDialog } from '../model/dialog-providers';
import { useQueryClient } from '@tanstack/react-query';

const StatusChangeDialogContent = () => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const { content, onClose } = useOrderListDialog();

  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{content.title}</AlertDialogTitle>
        <AlertDialogDescription>{content.description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>취소</AlertDialogCancel>
        <AlertDialogAction
          disabled={isLoading}
          onClick={async (e) => {
            e.stopPropagation();
            e.preventDefault();

            setIsLoading(true);

            await new Promise((resolve) => setTimeout(resolve, 3000));
            toast.success('주문 상태가 변경되었습니다');
            queryClient.invalidateQueries({ queryKey: ['orders'] });
            setIsLoading(false);
            onClose();
          }}
        >
          {isLoading && <Spinner className="size-4" />}
          {content.confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default StatusChangeDialogContent;
