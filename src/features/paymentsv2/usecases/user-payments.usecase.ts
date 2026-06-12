export interface UserPaymentsUseCase {
  payByCard: () => Promise<any>;
  payByBankTransfer: () => Promise<any>;
}
