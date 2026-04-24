'use client';

import useInventoryStore from '@/entities/inventory/model/useInventoryStore';
import { toast } from 'sonner';
import { ShoppingCart } from 'lucide-react';

import type { Product } from '@/entities/product';
import { AddedProductToast, ExistingProductToast } from '@/entities/product';
import CardActionButton from '@/shared/ui/CardActionButton';

const AddToCartBtn = ({ product }: { product: Product }) => {
  const { addInventory, isExistingProduct } = useInventoryStore();

  const handleAddToInventory = () => {
    if (isExistingProduct(product.id)) {
      toast.info(<ExistingProductToast />);
    } else {
      toast.success(<AddedProductToast />);
      addInventory({ product, quantity: 1 });
    }
  };

  return (
    <CardActionButton
      icon={<ShoppingCart className="h-4 w-4 text-white" strokeWidth={1.5} />}
      description="장바구니 담기"
      onClick={handleAddToInventory}
    />
  );
};

export default AddToCartBtn;
