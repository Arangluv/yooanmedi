'use client';

import { Cart } from 'lucide-react';

import useInventoryOpenStateStore from '../model/useInventoryOpenStateStore';

import TextWithIconAlignVertical from '@/shared/ui/TextWithIconAlignVertical';

const InventoryBtnAsLink = () => {
  const { onOpen } = useInventoryOpenStateStore();

  return (
    <TextWithIconAlignVertical
      text="장바구니"
      icon={<Cart className="size-6" strokeWidth={1.5} />}
      onClick={() => onOpen()}
    />
  );
};

export default InventoryBtnAsLink;
