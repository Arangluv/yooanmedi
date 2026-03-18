'use client';

import { useState } from 'react';

import { Form, NumberInput, Button } from '@heroui/react';
import { toast } from 'sonner';

import { useInventoryStore } from '@/entities/inventory';
import { AddedProductToast, ExistingProductToast } from '@/entities/product';

import useProductDetailStore from '../model/useProductDetailStore';

const DetailQuantityInputRow = () => {
  const [value, setValue] = useState<number>(0);

  const { clieckedProduct } = useProductDetailStore();
  const { addInventory, isExistingProduct } = useInventoryStore();

  const addInventoryWithQuantity = (quantity: number) => {
    if (!clieckedProduct) {
      return;
    }

    if (value < 1 || value > 999) {
      toast.error('주문수량은 1 이상 999 이하이어야 합니다.');
      setValue(0);
      return;
    }

    if (isExistingProduct(clieckedProduct.id)) {
      toast.info(<ExistingProductToast />);
      setValue(0);
      return;
    }

    addInventory({ product: clieckedProduct, quantity: Number(quantity) });
    setValue(0);
    toast.success(<AddedProductToast count={Number(quantity)} />);
  };

  const handleQuantitySaveSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { quantity } = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    addInventoryWithQuantity(Number(quantity));
  };

  return (
    <Form
      className="text-foreground-600 mt-2 flex items-start gap-2 text-sm"
      onSubmit={handleQuantitySaveSubmit}
      validationBehavior="native"
    >
      <span className="text-foreground-700 w-[100px] flex-shrink-0">주문수량</span>
      <div className="flex w-full items-start gap-2">
        <NumberInput
          aria-label="주문수량"
          size="sm"
          hideStepper
          radius="sm"
          name="quantity"
          defaultValue={0}
          value={value}
          onValueChange={(value) => setValue(value)}
          variant="bordered"
          description="입력 후 Enter를 눌러주세요."
          classNames={{
            inputWrapper: 'h-8 border-[1px]',
            description: 'text-sm text-warning',
            input: 'text-right',
          }}
        />
        <Button
          size="sm"
          radius="sm"
          className="bg-brand text-white"
          onPress={() => addInventoryWithQuantity(value)}
        >
          확인
        </Button>
      </div>
    </Form>
  );
};

export default DetailQuantityInputRow;
