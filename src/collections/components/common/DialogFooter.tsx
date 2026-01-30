'use client';

import { DialogClose, Button, DialogFooter } from '@collections/components/shadcn';

export default function CustomDialogFooter() {
  return (
    <DialogFooter className="px-2">
      <DialogClose asChild>
        <Button variant="default" size="lg">
          닫기
        </Button>
      </DialogClose>
      <Button variant="default" size="lg" className="bg-brand hover:bg-brand/90 text-white">
        저장
      </Button>
    </DialogFooter>
  );
}
