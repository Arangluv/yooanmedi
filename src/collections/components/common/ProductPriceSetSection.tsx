'use client';

import { TrashIcon } from 'lucide-react';
import { Button, Input, ScrollArea } from '@collections/components/shadcn';

import useProductSelectList from '@/app/(payload)/context/useProductSelectStore';
import { Product } from './Columns';
import TableEmpty from './TableEmpty';
import useCreateCustomPrice from '@/collections/hooks/useCreateCustomPrice';
import InLineAlertBox from './InLineAlertBox';

export default function ProductPriceSetSection() {
  const products = useProductSelectList((state) => state.products);
  const updateProductPrice = useProductSelectList((state) => state.updateProductPrice);
  const removeProduct = useProductSelectList((state) => state.removeProduct);
  const { onSaveCustomPrice, errors, isPendingForCreateCustomPrice } = useCreateCustomPrice();

  return (
    <div className="bg-card border-border flex w-full flex-col justify-between gap-4 rounded-md border p-4">
      <div className="flex h-[48px] flex-col justify-center gap-1">
        <span className="text-lg font-bold">가격 설정</span>
        <span className="text-muted-foreground text-sm">
          선택된 상품의 가격을 변경할 수 있으며{' '}
          <span className="text-primary font-medium">
            선택되지 않은 상품의 가격은 기존 가격으로 유지
          </span>
          됩니다.
        </span>
      </div>
      {/* 테이블 영역 */}
      <ScrollArea className="max-h-[400px]">
        <table className="w-full">
          <thead className="text-card-foreground bg-muted rounded-md text-sm">
            <tr>
              <th className="p-2 text-start">상품명</th>
              <th className="text-start">기존 가격</th>
              <th className="px-2 text-start">수정 가격</th>
              <th></th>
            </tr>
          </thead>
          <tbody className="min-h-[200px]">
            {Array.from(products.values()).length === 0 ? (
              <TableEmptyRow />
            ) : (
              Array.from(products.values()).map((item: Product) => (
                <TableRow
                  key={item.id}
                  product={item}
                  updateProductPrice={updateProductPrice}
                  removeProduct={removeProduct}
                  isError={errors.set.has(item.id)}
                />
              ))
            )}
          </tbody>
        </table>
      </ScrollArea>
      {errors.info.length > 0 && (
        <InLineAlertBox message={errors.info[0].message} variant="success" />
      )}
      {/* 저장 혹은 추가될 수 있는 액션영역 */}
      <div className="flex h-fit w-full items-center justify-end">
        <Button
          disabled={isPendingForCreateCustomPrice}
          variant="default"
          className="bg-brand hover:bg-brand/90 cursor-pointer text-white"
          onClick={onSaveCustomPrice}
        >
          가격 저장
        </Button>
      </div>
    </div>
  );
}

const TableEmptyRow = () => {
  return (
    <tr>
      <td colSpan={4}>
        <TableEmpty
          title="선택된 상품이 없습니다."
          description="등록된 상품에서 상품을 클릭해주세요"
        />
      </td>
    </tr>
  );
};

const TableRow = ({
  product,
  updateProductPrice,
  removeProduct,
  isError,
}: {
  product: Product;
  updateProductPrice: ({ id, price }: { id: number; price: number }) => void;
  removeProduct: (removeProduct: Product) => void;
  isError: boolean;
}) => {
  return (
    <tr
      data-id={product.id}
      data-error={isError}
      className="border-border text-card-foreground border-b font-normal data-[error=true]:bg-red-50"
    >
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
    <td className="max-w-[120px] px-2 py-2 text-end">
      <Input
        type="number"
        className="w-full"
        id={id.toString()}
        onChange={(e) => {
          updateProductPrice({ id, price: parseInt(e.target.value) || 0 });
          // 입력값이 바뀌면 상위 tr의 data-error를 false로 설정
          const tr = (e.target as HTMLInputElement).closest('tr');
          if (tr) {
            tr.setAttribute('data-error', 'false');
          }
        }}
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
  return (
    <td className="px-2 py-1 text-end">
      <Button
        variant="outline"
        size="icon"
        className="text-destructive hover:text-destructive/80 cursor-pointer border-none"
        onClick={() => removeProduct(product)}
      >
        <TrashIcon className="text-destructive size-4" />
      </Button>
    </td>
  );
};
