'use client';

import { useEffect, useState } from 'react';
import useProductSelectList, {
  SelectedProduct,
} from '@/app/(payload)/context/useProductSelectStore';
import useUserInfo, { TargetUser } from '@/app/(payload)/context/useUserInfo';
import { createCustomPrice } from '../apis/custom-price/actions';
import { useMutation } from '@tanstack/react-query';
import { toast } from '@payloadcms/ui';

type CreateCustomPriceInfoError = {
  message: string;
  id?: number;
};

type CreateCustomPriceError = {
  info: CreateCustomPriceInfoError[];
  set: Set<number>;
};

export default function useCreateCustomPrice() {
  const user = useUserInfo((state) => state.user);
  const products = useProductSelectList((state) => state.products);
  const clearProducts = useProductSelectList((state) => state.clearProducts);
  const [errors, setErrors] = useState<CreateCustomPriceError>({
    info: [],
    set: new Set(),
  });

  const { mutate: createCustomPriceMutation, isPending: isPendingForCreateCustomPrice } =
    useMutation({
      mutationFn: ({ products, user }: { products: SelectedProduct[]; user: TargetUser }) =>
        createCustomPrice({ products, user }),
      onSuccess: ({ success }) => {
        if (!success) {
          setErrors({
            info: [{ message: '고객별 가격을 생성하는데 문제가 발생했습니다.' }],
            set: new Set(),
          });
        } else {
          toast.success('고객별 가격을 생성했습니다.');
          clearProducts();
        }
      },
      onError: () => {
        console.log('createCustomPriceMutation error');
      },
    });

  const onSaveCustomPrice = () => {
    const productsArray = Array.from(products.values());
    const errors = {
      info: [] as CreateCustomPriceInfoError[],
      set: new Set<number>(),
    };

    productsArray.forEach((product) => {
      if (product.custom_price === 0) {
        const errorInfo: CreateCustomPriceInfoError = {
          message: '수정 가격이 0인 상품이 있습니다.',
          id: product.id,
        };

        errors.info.push(errorInfo);
        errors.set.add(product.id);
      }

      if (product.custom_price < 0) {
        const errorInfo: CreateCustomPriceInfoError = {
          message: '수정 가격이 0 미만인 상품이 있습니다.',
          id: product.id,
        };

        errors.info.push(errorInfo);
        errors.set.add(product.id);
      }
    });

    // errors 상태 업데이트
    setErrors(errors);

    if (errors.set.size > 0) {
      return;
    }

    createCustomPriceMutation({ products: productsArray, user });
  };

  const clearErrors = () => {
    setErrors({
      info: [],
      set: new Set(),
    });
  };

  useEffect(() => {
    // 상품이 바뀌는 이벤트가 나오면 error를 초기화한다.
    clearErrors();
  }, [products]);

  return { onSaveCustomPrice, errors, isPendingForCreateCustomPrice };
}
