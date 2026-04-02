import { BankTransferPaymentManager } from '@/features/payments/model/manager/bank-transfer-payment-manager';
import { OrderBankTransferDto } from '@/features/payments/model/schema/order-banktransfer-schema';

export const createBankTransferManagerFixture = async (dto: OrderBankTransferDto) => {
  const context = BankTransferPaymentManager.createContext(dto);
  const manager = await BankTransferPaymentManager.create(context);

  return manager;
};
