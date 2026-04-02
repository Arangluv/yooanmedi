'use server';

import { type OrderBankTransferDto } from '../model/schema/order-banktransfer-schema';
import { BankTransferPaymentManager } from '../model/manager/bank-transfer-payment-manager';
import { BankTransferPaymentInitContext } from '../model/schema/payment-context-schema';
import { handleError } from '@/shared/model/errors/handle-error';

export const orderBankTransfer = async (dto: OrderBankTransferDto) => {
  try {
    const paymentContext = BankTransferPaymentManager.createContext(dto);
    const paymentManager: BankTransferPaymentManager<BankTransferPaymentInitContext> =
      await BankTransferPaymentManager.create(paymentContext);

    // step 1. 주문 생성
    const order = await paymentManager.createOrder();
    paymentManager.applyOrderIdToContext(order.id);

    // step 2. 주문 사이드 이펙트 처리
    await paymentManager.processOrderSideEffects();

    // return {
    //   success: true,
    //   message: '무통장 입금 주문을 생성하였습니다.',
    // };
  } catch (error) {
    handleError(error);

    return {
      success: false,
      message: '무통장 입금 주문을 생성하는데 실패했습니다. 다시 시도해주세요.',
    };
  }
};
