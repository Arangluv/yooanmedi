'use client';

import { Fragment } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Info } from 'lucide-react';
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from '@heroui/react';
import { useMutation } from '@tanstack/react-query';
import { paymentBybankTransfer } from '../api/payments.api';
import { type CartItem } from '@/entities/cart';
import { useCart } from '@/entities/cart';

interface BankTransferButtonProps {
  deliveryRequest: string;
  cartItems: CartItem[];
  usedPoint: number;
  userId: number;
  minOrderPrice: number;
  amount: number;
}

const BankTransferButton = ({
  deliveryRequest,
  cartItems,
  usedPoint,
  userId,
  minOrderPrice,
  amount,
}: BankTransferButtonProps) => {
  const { clearCart } = useCart();
  const { isOpen, onOpen } = useDisclosure();

  const { mutate } = useMutation({
    mutationFn: () =>
      paymentBybankTransfer({
        deliveryRequest,
        orderList: cartItems,
        usedPoint,
        userId,
        minOrderPrice,
        amount,
      }),
    onSuccess: async (data) => {
      if (!data.isSuccess) {
        alert(data.message);
        return;
      }
      clearCart();
      onOpen();
    },
    onError: (error) => {
      console.error(error);
      alert('무통장 입금 주문을 생성하는데 실패했습니다. 다시 시도해주세요.');
    },
  });

  return (
    <Fragment>
      <Button size="lg" className="bg-brand w-full text-white" radius="sm" onPress={() => mutate()}>
        무통장 입금
      </Button>
      <BrakTransferModal isOpen={isOpen} />
    </Fragment>
  );
};

const BrakTransferModal = ({ isOpen }: { isOpen: boolean }) => {
  const router = useRouter();

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          router.push('/order/list');
        }
      }}
      size="xl"
    >
      <ModalBody>
        <ModalContent>
          <ModalHeader>무통장입금 결제 정보</ModalHeader>
          <ModalBody>
            <div className="flex w-full flex-col gap-1">
              <p className="font-bold text-green-600">주문이 완료되었습니다</p>
              <p>
                현재 주문은 처리 되었지만 <span className="text-brand font-bold">'결제대기'</span>{' '}
                상태입니다
              </p>
              <p>
                <span className="font-bold">입금 확인 후 주문처리가 완료</span>됩니다.
              </p>
              <p>
                <span className="font-bold">적립금은 입금 확인 후 적립됩니다.</span>
              </p>
              <div className="my-4 flex flex-col rounded-md bg-neutral-50 p-4">
                <span className="mb-3 flex items-center gap-1">
                  <Info className="h-4 w-4" />
                  <span>입금 계좌 정보</span>
                </span>
                <span className="mb-1 font-bold">예금주 : 유안메디팜</span>
                <span className="mb-1 font-bold">은행 : 우리은행</span>
                <span className="font-bold">계좌번호 : 1005-504-652055</span>
              </div>
              <p>
                주문내역에 대한 자세한 내용은{' '}
                <Link
                  href="/order/list"
                  prefetch={false}
                  className="text-brand hover:text-brandWeek font-bold transition-colors duration-300"
                >
                  이곳
                </Link>
                에서 확인하실 수 있습니다
              </p>
            </div>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </ModalBody>
    </Modal>
  );
};

export default BankTransferButton;
