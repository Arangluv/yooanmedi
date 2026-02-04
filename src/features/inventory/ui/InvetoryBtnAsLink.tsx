'use client';

import useInventoryOpenStateStore from '../model/useInventoryOpenStateStore';

const InventoryBtnAsLink = () => {
  const { onOpen } = useInventoryOpenStateStore();

  return (
    <button className="text-foreground-700 cursor-pointer" onClick={() => onOpen()}>
      장바구니
    </button>
  );
};

export default InventoryBtnAsLink;
