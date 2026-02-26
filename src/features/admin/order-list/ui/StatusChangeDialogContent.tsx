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
import { updateStrategy } from '../lib/update/strategy';
import { cancelStrategy } from '../lib/cancel/strategy';

const StatusChangeDialogContent = () => {
  const queryClient = useQueryClient();

  const [isLoading, setIsLoading] = useState(false);
  const { content, onClose, actionType, targetOrderIds } = useOrderListDialog();

  if (!actionType) {
    return null;
  }

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
            setIsLoading(true);
            e.stopPropagation();
            e.preventDefault();

            try {
              if (actionType.type === 'update') {
                await updateStrategy.execute({
                  scenario: actionType.scenario,
                  targetOrderIds: targetOrderIds,
                });
              } else {
                await cancelStrategy.execute({
                  scenario: actionType.scenario,
                  targetOrderIds: targetOrderIds,
                });
              }

              toast.success('주문 상태가 변경되었습니다');
              queryClient.invalidateQueries({ queryKey: ['orders'] });
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
          {content.confirmText}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default StatusChangeDialogContent;
