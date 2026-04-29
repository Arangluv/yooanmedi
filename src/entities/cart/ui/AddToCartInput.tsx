'use client';

import { useState } from 'react';
import { Form, NumberInput, Button } from '@heroui/react';
import { toast } from 'sonner';
import { useCart } from '../model/hooks/useCart';

const AddToCartInput = ({ productId }: { productId: number }) => {
  const [value, setValue] = useState<number>(0);
  const { addToCart } = useCart();

  const onAddToCart = () => {
    if (value < 1 || value > 999) {
      toast.error('주문수량은 1 이상 999 이하이어야 합니다.');
      setValue(0);
      return;
    }

    addToCart({
      quantity: value,
      product: productId,
    });
    setValue(0);
  };

  const handleQuantitySaveSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onAddToCart();
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
        <Button size="sm" radius="sm" className="bg-brand text-white" onPress={() => onAddToCart()}>
          확인
        </Button>
      </div>
    </Form>
  );
};

export default AddToCartInput;
