'use client';

import { TrashIcon } from 'lucide-react';
import { Button, Input } from '@collections/components/shadcn';

import useProductSelectList from '@/app/(payload)/context/useProductSelectStore';
import { Product } from './Columns';

export default function ProductPriceSetSection() {
  // UserListViewTable에서 선택한 행의 정보를 가져옴
  // 전역으로 선택한 행에 대한 정보를 관리해야 할 것이고
  // map을 사용하여 렌더링한다면 전체가 렌더링 될텐데 이 부분 생각
  const products = useProductSelectList((state) => state.products);
  const updateProductPrice = useProductSelectList((state) => state.updateProductPrice);
  const removeProduct = useProductSelectList((state) => state.removeProduct);

  return (
    <table>
      <thead className="text-foreground/60 rounded-md bg-neutral-100 text-sm">
        <tr>
          <th className="p-2 text-start">상품명</th>
          <th className="text-start">기존 가격</th>
          <th className="px-2 text-start">수정 가격</th>
          <th></th>
        </tr>
      </thead>
      <tbody className="max-h-[200px]">
        {products.map((item: Product) => (
          <TableRow
            key={item.id}
            product={item}
            updateProductPrice={updateProductPrice}
            removeProduct={removeProduct}
          />
        ))}
      </tbody>
    </table>
  );
}

const TableRow = ({
  product,
  updateProductPrice,
  removeProduct,
}: {
  product: Product;
  updateProductPrice: ({ id, price }: { id: number; price: number }) => void;
  removeProduct: (removeProduct: Product) => void;
}) => {
  return (
    <tr className="border-b border-neutral-200 font-normal text-neutral-800">
      <td className="px-2 py-1 text-start font-medium">{product.name}</td>
      <PriceCell price={product.price} />
      <EditPriceCell id={product.id} updateProductPrice={updateProductPrice} />
      <DeleteCell product={product} removeProduct={removeProduct} />
    </tr>
  );
};

const PriceCell = ({ price }: { price: number }) => {
  const formattedPrice = new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);

  return <td className="py-1 text-start font-medium">{formattedPrice}</td>;
};

const EditPriceCell = ({
  id,
  updateProductPrice,
}: {
  id: number;
  updateProductPrice: ({ id, price }: { id: number; price: number }) => void;
}) => {
  // 1. store에서 가지는 product가 가지는 type은 따로 정의해야 할듯 (custom price 필드가 있어야함)
  // 2. 현재 useEffect에서 관리하지만 체크 시 로직이 동작하게 수정
  // 3. 업데이트 방식은 포커스의 해제가 있겠지만 안전하지는 않다 -> 디바운스 고려

  return (
    <td className="max-w-[100px] px-2 py-2 text-end">
      <Input
        type="number"
        className="w-full"
        onChange={(e) => updateProductPrice({ id, price: parseInt(e.target.value) || 0 })}
      />
    </td>
  );
};

const DeleteCell = ({
  product,
  removeProduct,
}: {
  product: Product;
  removeProduct: (removeProduct: Product) => void;
}) => {
  // 1. store에서 제거하고
  // 2. 삭제 버튼 클릭 시 체크박스에서 체크가 해제

  return (
    <td className="px-2 py-1 text-end">
      <Button
        variant="outline"
        size="icon"
        className="text-destructive hover:text-destructive/80 cursor-pointer border-none"
        onClick={() => removeProduct(product)}
      >
        <TrashIcon className="size-4 text-red-400" />
      </Button>
    </td>
  );
};
