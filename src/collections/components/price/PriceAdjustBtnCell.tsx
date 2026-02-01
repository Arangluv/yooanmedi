'use client';

import { DialogTrigger } from '@collections/components/shadcn';
import { Button } from '@collections/components/shadcn';
import useUserInfo from '@/app/(payload)/context/useUserInfo';

export default function PriceAdjustBtnCell(props: any) {
  const setUser = useUserInfo((state) => state.setUser);
  const { rowData } = props;
  const { id, hospitalName, ceo, email } = rowData;

  if (rowData.role === 'admin') {
    return null;
  }

  setUser({
    id: id,
    hosipital_name: hospitalName,
    ceo_name: ceo,
    email: email,
  });

  return (
    <DialogTrigger asChild>
      <Button className="bg-brand rounded-md px-4 py-2 text-white">가격 조정</Button>
    </DialogTrigger>
  );
}
