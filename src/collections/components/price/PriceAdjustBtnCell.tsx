'use client';

import { DialogTrigger } from '@collections/components/shadcn';
import { Button } from '@collections/components/shadcn';

export default function PriceAdjustBtnCell(props: any) {
  const { cellData, rowData, field } = props;

  if (rowData.role === 'admin') {
    return null;
  }

  return (
    <DialogTrigger asChild>
      <Button className="bg-brand rounded-md px-4 py-2 text-white">가격 조정</Button>
    </DialogTrigger>
  );
}
