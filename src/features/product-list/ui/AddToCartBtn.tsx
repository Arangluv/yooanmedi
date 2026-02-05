'use client';

import useInventoryStore from '@/entities/inventory/model/useInventoryStore';
import { toast } from 'sonner';
import { Tooltip } from '@heroui/react';
import { ShoppingCart } from 'lucide-react';

import type { ProductItem } from '@/entities/product';
import { AddedProductToast, ExistingProductToast } from '@/entities/product';

const AddToCartBtn = ({ product }: { product: ProductItem }) => {
  const { inventory, addInventory, isExistingProduct } = useInventoryStore();

  const handleAddToInventory = () => {
    if (isExistingProduct(product.id)) {
      toast.info(<ExistingProductToast />);
    } else {
      toast.success(<AddedProductToast />);
      addInventory({ product, quantity: 1 });
    }
  };

  return (
    <button
      className="absolute right-2 bottom-2 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-neutral-100"
      style={{ boxShadow: '0 0 10px 0 rgba(0, 0, 0, 0.2)' }}
      onClick={handleAddToInventory}
    >
      <Tooltip content="장바구니 담기" showArrow={true} classNames={{ content: 'text-brandWeek' }}>
        <ShoppingCart className="text-brand h-5 w-5" />
      </Tooltip>
    </button>
  );
};

export default AddToCartBtn;
