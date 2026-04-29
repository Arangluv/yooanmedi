'use client';

import { ShoppingCart } from 'lucide-react';
import useInventoryOpenStateStore from '../model/useInventoryOpenStateStore';
import TextWithIconAlignVertical from '@/shared/ui/TextWithIconAlignVertical';

const InventoryBtnAsLink = () => {
  const { onOpen } = useInventoryOpenStateStore();

  return (
    <TextWithIconAlignVertical
      text="장바구니"
      icon={<ShoppingCart className="size-6" strokeWidth={1.5} />}
      onClick={() => onOpen()}
    />
  );
};

export default InventoryBtnAsLink;
