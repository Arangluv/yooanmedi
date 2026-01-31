'use client';

import useProductSelectList from '@/app/(payload)/context/useProductSelectStore';
import { DialogClose, Button, DialogFooter } from '@collections/components/shadcn';

export default function CustomDialogFooter() {
  const clearProducts = useProductSelectList((state) => state.clearProducts);

  return (
    <DialogFooter className="px-2">
      <DialogClose asChild>
        <Button variant="default" size="lg" onClick={clearProducts}>
          닫기
        </Button>
      </DialogClose>
      <Button variant="default" size="lg" className="bg-brand hover:bg-brand/90 text-white">
        저장
      </Button>
    </DialogFooter>
  );
}
