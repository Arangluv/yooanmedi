import { getPayload } from '@/shared/server';
import { EasyPayAdapter, EasyPayApiRepository } from '@/entities/easypay/infrastructure';
import { ProductAdapter, ProductApiRepository } from '@/entities/product/infrastructure';
import { PointHistoryAdapter, PointHistoryApiRepository } from '@/entities/point/infrastructure';
import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { OrderAdapter, OrderApiRepository } from '@/entities/order/infrastructure';
import {
  OrderProductAdapter,
  OrderProductApiRepository,
} from '@/entities/order-product/infrastructure';
import {
  PurchasedHistoryAdapter,
  PurchasedHistoryApiRepository,
} from '@/entities/purchased-history/infrastructure';
import {
  PaymentHistoryAdapter,
  PaymentHistoryApiRepository,
} from '@/entities/payment/infrastructure';
import { PGPaymentRequestDto, BankTransferPaymentRequestDto } from '../../dto';
import { PaymentCommandHelper } from '../libs';
import { PGCommandDependencies, PGPaymentCommand } from './pg-payment.command';
import {
  BankTransferCommandDependencies,
  BankTransferPaymentCommand,
} from './bank-transfer-payment.command';

export class PaymentCommandFactory {
  static async createCommandForPG(dto: PGPaymentRequestDto) {
    const dependencies: PGCommandDependencies = {
      payload: await getPayload(),
      repository: {
        easyPay: new EasyPayApiRepository(EasyPayAdapter()),
        pointHistory: new PointHistoryApiRepository(PointHistoryAdapter()),
        user: new UserApiRepository(UserAdapter()),
        order: new OrderApiRepository(OrderAdapter()),
        orderProduct: new OrderProductApiRepository(OrderProductAdapter()),
        purchasedHistory: new PurchasedHistoryApiRepository(PurchasedHistoryAdapter()),
        paymentHistory: new PaymentHistoryApiRepository(PaymentHistoryAdapter()),
      },
    };

    const productRepository = new ProductApiRepository(ProductAdapter());
    const paymentAuthResult = PaymentCommandHelper.toPaymentAuthResult(dto);
    const commandDto = await PaymentCommandHelper.createPGCommandDto(
      paymentAuthResult,
      productRepository,
    );

    return new PGPaymentCommand(commandDto, dependencies);
  }

  static async createCommandForBankTransfer(dto: BankTransferPaymentRequestDto) {
    const dependencies: BankTransferCommandDependencies = {
      payload: await getPayload(),
      repository: {
        pointHistory: new PointHistoryApiRepository(PointHistoryAdapter()),
        user: new UserApiRepository(UserAdapter()),
        order: new OrderApiRepository(OrderAdapter()),
        orderProduct: new OrderProductApiRepository(OrderProductAdapter()),
        purchasedHistory: new PurchasedHistoryApiRepository(PurchasedHistoryAdapter()),
      },
    };

    const commandDto = await PaymentCommandHelper.createBankTransferCommandDto(dto);
    return new BankTransferPaymentCommand(commandDto, dependencies);
  }
}
