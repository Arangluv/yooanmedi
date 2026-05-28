import { PointItem } from '../types';
import { PAYMENTS_METHOD, PaymentsMethod } from '@/shared';

export class PointCalculator {
  static forItem(item: PointItem, rate: number): number {
    return Math.floor(item.price * (rate / 100));
  }

  static forBank(item: PointItem) {
    const rate = item.rates[PAYMENTS_METHOD.bank_transfer];
    return PointCalculator.forItem(item, rate);
  }

  static forCard(item: PointItem) {
    const rate = item.rates[PAYMENTS_METHOD.credit_card];
    return PointCalculator.forItem(item, rate);
  }

  static forBankWithQuantity(item: PointItem) {
    const rate = item.rates[PAYMENTS_METHOD.bank_transfer];
    return PointCalculator.forItem(item, rate) * item.quantity;
  }

  static forCardWithQuantity(item: PointItem) {
    const rate = item.rates[PAYMENTS_METHOD.credit_card];
    return PointCalculator.forItem(item, rate) * item.quantity;
  }

  // 결제 수단별 단일 상품 적립금
  static forPayment(item: PointItem, method: PaymentsMethod): number {
    return PointCalculator.forItem(item, item.rates[method]);
  }

  // 단일 상품 최대 적립금
  static maxForItem(item: PointItem): number {
    return Math.max(PointCalculator.forBank(item), PointCalculator.forCard(item));
  }

  static maxForItemWithQuantity(item: PointItem): number {
    const priceForCard = PointCalculator.forCardWithQuantity(item);
    const priceForBank = PointCalculator.forBankWithQuantity(item);

    return Math.max(priceForCard, priceForBank);
  }

  // 장바구니 전체 적립금
  static totalForCart(items: PointItem[], method: PaymentsMethod): number {
    return items.reduce((sum, item) => {
      return sum + PointCalculator.forPayment(item, method) * item.quantity;
    }, 0);
  }

  static earn(current: number, delta: number): number {
    return current + delta;
  }

  static use(current: number, delta: number): number {
    return current - delta;
  }

  static cancelEarn(current: number, delta: number): number {
    return current - delta;
  }

  static cancelUse(current: number, delta: number): number {
    return current + delta;
  }
}
