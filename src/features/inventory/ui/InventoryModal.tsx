'use client';

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from '@heroui/react';

import { useInventoryStore } from '@/entities/inventory';
import { getDeliveryFeeFromProduct } from '@/entities/price';
import { formatNumberWithCommas, useSiteMetaStore } from '@/shared';

import InventoryQuantityEditCell from './InventoryQuantityEditCell';
import InventoryItemDeleteCell from './InventoryItemDeleteCell';
import PriceOverview from './PriceOverview';
import useInventoryOpenStateStore from '../model/useInventoryOpenStateStore';

const InventoryModal = () => {
  const { inventory } = useInventoryStore();
  const { minOrderPrice } = useSiteMetaStore();
  const { isOpen, onOpenChange } = useInventoryOpenStateStore();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      size="5xl"
      radius="sm"
      classNames={{ base: 'max-w-[1180px]' }}
    >
      <ModalContent>
        <ModalHeader>
          <span className="text-lg font-bold">장바구니(주문내역)</span>
        </ModalHeader>
        <ModalBody>
          <table>
            <thead>
              <tr className="text-foreground-700 bg-neutral-100 text-[14px]">
                <th className="border-foreground-200 border-1 py-2">날짜</th>
                <th className="border-foreground-200 border-1">보험코드</th>
                <th className="border-foreground-200 border-1">상품명</th>
                <th className="border-foreground-200 border-1">제조사</th>
                <th className="border-foreground-200 border-1">규격</th>
                <th className="border-foreground-200 border-1">단가</th>
                <th className="border-foreground-200 min-w-[40px] border-1">수량</th>
                <th className="border-foreground-200 border-1">배송비</th>
                <th className="border-foreground-200 border-1">총 배송비</th>
                <th className="border-foreground-200 border-1">삭제</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map(({ product, quantity }) => (
                <tr
                  className="text-foreground-700 border-foreground-200 border-1 text-[14px]"
                  key={product.id}
                >
                  <td className="border-foreground-200 border-r-1 py-2 pl-2 text-center">
                    {new Date().toISOString().slice(0, 10)}
                  </td>
                  <td className="border-foreground-200 border-r-1 text-center">
                    {product.insurance_code ? product.insurance_code : '-'}
                  </td>
                  <td className="border-foreground-200 border-r-1 py-2 pl-2 text-center">
                    {product.name}
                  </td>
                  <td className="border-foreground-200 border-r-1 py-2 pl-2 text-center">
                    {product.manufacturer}
                  </td>
                  <td className="border-foreground-200 border-r-1 text-center">
                    {product.specification}
                  </td>
                  <td className="border-foreground-200 border-r-1 pr-2 text-end">
                    {formatNumberWithCommas(product.price)}원
                  </td>
                  <td className="border-foreground-200 border-r-1 text-end">
                    <InventoryQuantityEditCell inventoryItem={{ product, quantity }} />
                  </td>
                  <td className="border-foreground-200 border-r-1 pr-2 text-end">
                    {formatNumberWithCommas(product.delivery_fee)}원
                  </td>
                  <td className="border-foreground-200 border-r-1 pr-2 text-end">
                    {getDeliveryFeeFromProduct({ product, quantity })}원
                  </td>
                  <td>
                    <InventoryItemDeleteCell inventoryItem={{ product, quantity }} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ModalBody>
        <ModalFooter className="flex flex-col">
          <PriceOverview minOrderPrice={minOrderPrice} />
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default InventoryModal;
