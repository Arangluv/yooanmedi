import { describe, it, expect } from 'vitest';
import { EasyPayService } from '@/entities/easypay/model/easypay.service';
import { IEasyPay } from '@/entities/easypay';
import {
  BankTransferContextFactory,
  PaymentContextFactory,
  PGContextFactory,
} from './context.factory';
import { enrichOrderList } from './enrich-order-list';
import { basePaymentContextSchema } from './schemas/payments-context/base.schema';
import { bankTransferPaymentInitContextSchema } from './schemas/payments-context/bank-transfer.schema';
import { paymentInitContextSchema } from './schemas/payments-context/pg.schema';
import {
  bankTransferRequestDtoFixture,
  createPGRequestDtoFixture,
} from '../__test__/payments.fixture';

describe('BankTransferContextFactory', () => {
  const contextFactory = new BankTransferContextFactory();

  it('[createBase] requestDto가 baseContext로 변환된다', () => {
    const result = contextFactory.createBase(bankTransferRequestDtoFixture);
    expect(result).toEqual(expect.schemaMatching(basePaymentContextSchema));
  });

  it('[initialize] baseContext가 initContext로 변환된다', async () => {
    const baseContext = contextFactory.createBase(bankTransferRequestDtoFixture);
    const orderList = await enrichOrderList(baseContext);
    const initCtx = contextFactory.initialize({
      ...baseContext,
      orderList,
      amount: bankTransferRequestDtoFixture.amount,
    });

    expect(initCtx).toEqual(expect.schemaMatching(bankTransferPaymentInitContextSchema));
  });
});

describe('PGContextFactory', () => {
  const contextFactory = new PGContextFactory();
  const easypayService = new EasyPayService();
  const { registerResult, baseContext } = createPGBaseContext(contextFactory, easypayService);

  it('createBase', () => {
    expect(baseContext).toEqual(expect.schemaMatching(basePaymentContextSchema));
  });

  it('initialize', async () => {
    const orderList = await enrichOrderList(baseContext);
    const initCtx = contextFactory.initialize({
      ...baseContext,
      orderList,
      authorizationId: registerResult.authorizationId,
    });

    expect(initCtx).toEqual(expect.schemaMatching(paymentInitContextSchema));
  });
});

function createPGBaseContext(contextFactory: PaymentContextFactory, easypayService: IEasyPay) {
  const requestDto = createPGRequestDtoFixture();
  let data = {} as any;
  requestDto.forEach((value: any, key: string) => {
    data[key as string] = value;
  });
  const registerResult = easypayService.validateAndParseRegisterTransactionResult(data);
  const baseContext = contextFactory.createBase(registerResult);

  return { registerResult, baseContext };
}
