'use client';

import Image from 'next/image';
import { Button, Divider, Form } from '@heroui/react';
import { clsx } from 'clsx';
import { NumberInput } from '@heroui/react';
import {
  InventoryContext,
  OrderUserInfoContext,
  ProductInfoContext,
} from '@order/_context/order_context';
import { useContext, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { ProductItemType } from '../../_type';
import { formatNumberWithCommas, getPointOnPurchase } from '../../utils';
import { AddedProductToast, ExistingProductToast } from './ToastComponents';
import { toast } from 'sonner';
import { getCurrentUserOrderHistory } from '../../actions';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';

export default function ProductDeatilAsideSection() {
  const { clickedProduct } = useContext(ProductInfoContext);
  const { inventory, setInventory } = useContext(InventoryContext);
  const { user } = useContext(OrderUserInfoContext);

  return clickedProduct ? (
    <SelectedProductDetailSection
      product={clickedProduct}
      inventory={inventory}
      setInventory={setInventory}
      user={user}
    />
  ) : (
    <EmptyProductDetailSection />
  );
}

function EmptyProductDetailSection() {
  return (
    <div className="fixed top-[148px] right-0 flex w-[calc((100%-1024px)/2)] flex-col gap-8 px-8">
      {/* 상품 디테일 */}
      <div
        style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)' }}
        className="flex w-full max-w-[400px] flex-col gap-4 rounded-lg bg-white p-4"
      >
        <span className="font-bold">상품 정보</span>
        <div className="flex flex-col gap-1">
          <div className="mb-4 flex h-[150px] w-full items-center justify-center gap-2 overflow-hidden rounded-md bg-neutral-100">
            <ImageIcon className="text-foreground-200 h-6 w-6" />
            <span className="text-foreground-600 text-sm">상품을 선택해주세요.</span>
          </div>
          <ProductDetailEmptySection name="상품명" />
          <ProductDetailEmptySection name="제조사" />
          <ProductDetailEmptySection name="규격" />
          <ProductDetailEmptySection name="가격" />
          <ProductDetailEmptySection name="보험코드" />
          <ProductDetailEmptySection name="재고" />
        </div>
      </div>
    </div>
  );
}

function SelectedProductDetailSection({
  product,
  inventory,
  setInventory,
  user,
}: {
  product: ProductItemType;
  inventory: Array<{
    product: ProductItemType;
    quantity: number;
  }>;
  setInventory: (
    inventory: Array<{
      product: ProductItemType;
      quantity: number;
    }>,
  ) => void;
  user: any;
}) {
  const {
    id,
    name,
    manufacturer,
    price,
    specification,
    insurance_code,
    stock,
    delivery_fee,
    cashback_rate,
    cashback_rate_for_bank,
    returnable,
    is_cost_per_unit,
  } = product;

  return (
    <div className="fixed top-[148px] right-0 flex w-[calc((100%-1024px)/2)] flex-col gap-8 px-8">
      {/* 상품 디테일 */}
      <div
        style={{ boxShadow: '0 0 6px 0 rgba(0, 0, 0, 0.2)' }}
        className="flex w-full max-w-[400px] flex-col gap-4 rounded-lg bg-white p-4"
      >
        <span className="font-bold">상품 정보</span>
        <div className="flex flex-col gap-1">
          <div className="mb-4 h-[150px] w-full overflow-hidden rounded-md bg-neutral-100">
            {product.image?.url ? (
              <Image
                src={product.image.url}
                alt={product.image.alt ?? ''}
                width={150}
                height={150}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center gap-1">
                <ImageIcon className="text-foreground-300 h-6 w-6" strokeWidth={1.5} />
                <span className="text-foreground-600 text-sm">상품 이미지를 준비중입니다.</span>
              </div>
            )}
          </div>
          <ProductDetailSection name="상품명" value={name} />
          <ProductDetailSection name="제조사" value={manufacturer} />
          <ProductDetailSection name="가격" value={`${formatNumberWithCommas(price)}원`} />
          <ProductDetailSection name="규격" value={specification ?? ''} />
          <ProductDetailSection name="보험코드" value={insurance_code ?? ''} />
          <ProductDeliveryFeeSection
            name="배송비"
            value={`${formatNumberWithCommas(delivery_fee)}원`}
            is_cost_per_unit={is_cost_per_unit}
          />
          <ProductDetailSection
            name="재고"
            value={stock > 0 ? '재고 있음' : '재고 없음'}
            accent={stock > 0 ? 'brand' : 'danger'}
          />
          <ProductDetailSection
            name="반품가능여부"
            value={returnable ? '반품 가능' : '반품 불가능'}
            accent={returnable ? 'brand' : 'danger'}
          />
          <ProductPurchaseHistorySection prod_id={id} user_id={user.id} />
          <Divider className="my-2" />
          <ProductPointBenefitSection
            price={price}
            rate={cashback_rate}
            rate_for_bank={cashback_rate_for_bank}
          />
          <ProductQuantityInput
            inventory={inventory}
            setInventory={setInventory}
            product={product}
          />
        </div>
      </div>
    </div>
  );
}

function ProductDetailEmptySection({ name }: { name: string }) {
  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">{name}</span>
    </div>
  );
}

function ProductDeliveryFeeSection({
  name,
  value,
  is_cost_per_unit,
}: {
  name: string;
  value: string;
  is_cost_per_unit: boolean;
}) {
  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">{name}</span>
      <span className="text-foreground-600 flex items-center gap-1">
        <span>{value}</span>
        <span className="text-brandWeek text-sm font-bold">
          {is_cost_per_unit ? '(수량 당)' : ''}
        </span>
      </span>
    </div>
  );
}

function ProductDetailSection({
  name,
  value,
  accent = 'default',
  isBold = false,
}: {
  name: string;
  value: string;
  accent?: 'brand' | 'danger' | 'default';
  isBold?: boolean;
}) {
  if (!value) {
    return null;
  }

  const accentColor =
    accent === 'brand'
      ? 'text-brandWeek'
      : accent === 'danger'
        ? 'text-danger'
        : 'text-foreground-600';

  const fontWeight = isBold ? 'font-bold' : 'font-normal';

  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">{name}</span>
      <span className={clsx(accentColor, fontWeight)}>{value}</span>
    </div>
  );
}

function ProductPointBenefitSection({
  price,
  rate,
  rate_for_bank,
}: {
  price: number;
  rate: number;
  rate_for_bank: number;
}) {
  const willEarnPoint = getPointOnPurchase(price, rate);
  const willEarnPointForBank = getPointOnPurchase(price, rate_for_bank);

  if (
    (willEarnPoint === '0' && willEarnPointForBank === '0') ||
    (!willEarnPoint && !willEarnPointForBank)
  ) {
    return null;
  }

  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 block w-[100px] flex-shrink-0">결제혜택</span>
      <div className="flex flex-col gap-1">
        {Number(willEarnPoint) > 0 && (
          <span className="text-brandWeek">
            카드 결제시 <span className="font-bold">{willEarnPoint}원</span> 적립
          </span>
        )}
        {Number(willEarnPointForBank) > 0 && (
          <span className="text-brandWeek">
            무통장 입금시 <span className="font-bold">{willEarnPointForBank}원</span> 적립
          </span>
        )}
      </div>
    </div>
  );
}

function ProductQuantityInput({
  inventory,
  setInventory,
  product,
}: {
  inventory: Array<{
    product: ProductItemType;
    quantity: number;
  }>;
  setInventory: (
    inventory: Array<{
      product: ProductItemType;
      quantity: number;
    }>,
  ) => void;
  product: ProductItemType;
}) {
  const [value, setValue] = useState<number>(0);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { quantity } = Object.fromEntries(new FormData(e.target as HTMLFormElement));

    if (value < 1 || value > 999) {
      toast.error('주문수량은 1 이상 999 이하이어야 합니다.');
      setValue(0);
      return;
    }

    const isUserAdded = inventory.some((item) => item.product.id === product.id);

    if (isUserAdded) {
      toast.info(<ExistingProductToast />);
      setValue(0);
      return;
    } else {
      const newInventory = [...inventory, { product, quantity: Number(quantity) }];
      setInventory(newInventory);
      setValue(0);
      toast.success(<AddedProductToast count={Number(quantity)} />);
    }
  };

  const handlePressBtn = () => {
    const isUserAdded = inventory.some((item) => item.product.id === product.id);

    if (value < 1 || value > 999) {
      toast.error('주문수량은 1 이상 999 이하이어야 합니다.');
      setValue(0);
      return;
    }

    if (isUserAdded) {
      toast.info(<ExistingProductToast />);
      return;
    }

    const newInventory = [...inventory, { product, quantity: value }];
    setInventory(newInventory);
    setValue(0);
    toast.success(<AddedProductToast count={value} />);
  };

  return (
    <Form
      className="text-foreground-600 mt-2 flex items-start gap-2 text-sm"
      onSubmit={onSubmit}
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
          // @ts-ignore
          onChange={(e) => setValue(Number(e.target.value))}
          validate={(value) => {
            if (!value) {
              return '주문수량을 입력해주세요.';
            }

            if (value < 1 || value > 999) {
              return '주문수량은 1 이상 999 이하이어야 합니다.';
            }

            return true;
          }}
          variant="bordered"
          description="입력 후 Enter를 눌러주세요."
          classNames={{
            inputWrapper: 'h-8 border-[1px]',
            description: 'text-sm text-warning',
            input: 'text-right',
          }}
        />
        <Button size="sm" radius="sm" className="bg-brand text-white" onPress={handlePressBtn}>
          확인
        </Button>
      </div>
    </Form>
  );
}

function ProductPurchaseHistorySection({ prod_id, user_id }: { prod_id: number; user_id: number }) {
  const { data } = useQuery({
    queryKey: ['order-history', prod_id, user_id],
    queryFn: () => getCurrentUserOrderHistory({ prod_id, user_id }),
  });

  if (!data || data.length === 0) {
    return null;
  }

  return (
    <div className="text-foreground-600 flex items-start gap-2 text-sm">
      <span className="text-foreground-700 w-[100px] flex-shrink-0">최근 구매내역</span>
      <table className="w-full">
        <thead>
          <tr className="border-foreground-200 border-1 bg-neutral-100 text-sm">
            <th className="border-foreground-200 border-r-1">구매일시</th>
            <th className="border-foreground-200 border-r-1">수량</th>
            <th>단가</th>
          </tr>
        </thead>
        <tbody>
          {data?.map((item) => (
            <tr key={item.id} className="border-foreground-200 border-1 text-xs">
              <td className="border-foreground-200 border-r-1 py-1 text-center">
                {moment(item.orderCreatedAt).format('YYYY-MM-DD')}
              </td>
              <td className="border-foreground-200 border-r-1 text-center">{item.quantity}</td>
              {/* @ts-ignore */}
              <td className="text-center">{formatNumberWithCommas(item.product.price)}원</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
