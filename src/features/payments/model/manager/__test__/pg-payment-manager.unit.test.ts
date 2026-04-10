import { describe, it, expect, expectTypeOf, beforeEach, vi, Mock } from 'vitest';
import { PGPaymentManager } from '@/features/payments/model/manager/pg-payment-manager';
// import { PAYMENTS_RESPONSE_SUCCESS_CODE } from '@/features/payments/constants/payment-gateway-code';
// import {
//   createPaymentRegisterFixture,
//   createPaymentRegisterFailureFixture,
//   basePaymentApprovalFixture,
// } from '@/shared/__mock__/payment.pg.fixture';
// import { BusinessLogicError } from '@/shared/model/errors/domain.error';
// import {
//   PGPaymentContextAfterApproval,
//   PGPaymentContextAfterOrder,
//   PGPaymentInitContext,
// } from '../../schema/payment-context-schema';
// import { PAYMENTS_METHOD } from '@/entities/order/constants/payments-options';
// import { handleError } from '@/shared/model/errors/handle-error';
// import { transformOrderListToInventory } from '@/entities/inventory/lib/transform';
// import { basePaymentInventoryFixture } from '@/shared/__mock__/payment.bank.fixture';
// import { paymentsApproval } from '@/features/payments/api/payment-approval';
// import { createOrder as createOrderFromEntityLayer } from '@/entities/order/api/create-order';
// import { createOrderProduct } from '@/entities/order-product/api/create-order-product';
// import { createRecentPurchasedHistory } from '@/entities/recent-purchased-history';
// import { UsePointTransaction } from '@/entities/point/lib/use/point-transaction';
// import { createOrderProductSchema } from '@/entities/order-product/model/create-order-product.schema';
// import { createRecentPurchasedHistorySchema } from '@/entities/recent-purchased-history/model/create-schema';

// vi.mock('@/entities/inventory/lib/transform', () => ({
//   transformOrderListToInventory: vi.fn(),
// }));

// vi.mock('@/features/payments/api/payment-approval', () => ({
//   paymentsApproval: vi.fn(),
// }));

// vi.mock('@/entities/order/api/create-order', () => ({
//   createOrder: vi.fn(),
// }));

// vi.mock('@/entities/order-product/api/create-order-product', () => ({
//   createOrderProduct: vi.fn(),
// }));

// vi.mock('@/entities/recent-purchased-history/api/create', () => ({
//   createRecentPurchasedHistory: vi.fn(),
// }));

// vi.mock('@/entities/point/lib/use/create-transaction', () => ({
//   createUsePointTransaction: vi.fn(),
// }));

// vi.mock('@/entities/order/api/create-order', () => ({
//   createOrder: vi.fn(),
// }));

describe('[PGPaymentManager]', () => {
  // // Step 1. 결제등록 결과 파싱
  // describe('[validatePaymentRegister]', () => {
  //   it('formData를 파싱하여 결제등록 결과를 반환한다.', () => {
  //     const formData = createPaymentRegisterFixture();
  //     const result = PGPaymentManager.validatePaymentRegister(formData);
  //     expect(result.resCd).toBe(PAYMENTS_RESPONSE_SUCCESS_CODE);
  //   });
  //   it('올바르지 않은 formData가 전달된 경우 BusinessLogicError를 반환한다.', () => {
  //     const formData = createPaymentRegisterFailureFixture();
  //     expect(() => PGPaymentManager.validatePaymentRegister(formData)).toThrowError(
  //       BusinessLogicError,
  //     );
  //   });
  // });
  // // Step 2. 결제 초기 컨텍스트 생성
  // describe('[createInitialContext]', () => {
  //   it('결제등록 결과를 통해 결제 초기 컨텍스트를 생성한다.', () => {
  //     try {
  //       const formData = createPaymentRegisterFixture();
  //       const result = PGPaymentManager.validatePaymentRegister(formData);
  //       const context = PGPaymentManager.createInitialContext(result);
  //       // check type
  //       expectTypeOf(context).toEqualTypeOf<PGPaymentInitContext>();
  //       // check add paymentsMethod
  //       expect(context.paymentsMethod).toBe(PAYMENTS_METHOD.CREDIT_CARD);
  //     } catch (error) {
  //       handleError(error);
  //     }
  //   });
  // });
  // // Step 3. approvePayment 생성
  // describe('[approvePayment]', () => {
  //   let paymentManager: PGPaymentManager<PGPaymentInitContext>;
  //   beforeEach(async () => {
  //     vi.stubEnv('PAYMENTS_MID', 'test-mid');
  //     vi.mocked(transformOrderListToInventory).mockResolvedValue(basePaymentInventoryFixture);
  //     vi.mocked(paymentsApproval).mockResolvedValue(basePaymentApprovalFixture);
  //     const formData = createPaymentRegisterFixture();
  //     const result = PGPaymentManager.validatePaymentRegister(formData);
  //     const context = PGPaymentManager.createInitialContext(result);
  //     paymentManager = await PGPaymentManager.create(context);
  //   });
  //   it('결제 승인 이후 승인 결과를 context에 적용한다.', async () => {
  //     const approvalResult = await paymentManager.approvePayment();
  //     paymentManager.applyApprovalResultToContext(approvalResult);
  //     const context = paymentManager.getContext();
  //     expect(context.amount).toBe(basePaymentApprovalFixture.amount);
  //     expect(context.pgCno).toBe(basePaymentApprovalFixture.pgCno);
  //     expect(context.approvalDate).toBeDefined();
  //   });
  // });
  // // Step 4. 주문 생성
  // describe('[createOrder]', () => {
  //   let paymentManager: PGPaymentManager<PGPaymentInitContext>;
  //   beforeEach(async () => {
  //     vi.stubEnv('PAYMENTS_MID', 'test-mid');
  //     vi.mocked(transformOrderListToInventory).mockResolvedValue(basePaymentInventoryFixture);
  //     vi.mocked(paymentsApproval).mockResolvedValue(basePaymentApprovalFixture);
  //     vi.mocked(createOrderFromEntityLayer).mockResolvedValue({ id: 123 } as any);
  //     const formData = createPaymentRegisterFixture();
  //     const result = PGPaymentManager.validatePaymentRegister(formData);
  //     const context = PGPaymentManager.createInitialContext(result);
  //     paymentManager = await PGPaymentManager.create(context);
  //   });
  //   it('주문을 생성한 후 주문 아이디를 context에 적용한다.', async () => {
  //     const approvalResult = await paymentManager.approvePayment();
  //     paymentManager.applyApprovalResultToContext(approvalResult);
  //     const order = await paymentManager.createOrder();
  //     paymentManager.applyOrderIdToContext(order.id);
  //     const context = paymentManager.getContext();
  //     expect(context.orderId).toBe(order.id);
  //     expectTypeOf(context).toEqualTypeOf<PGPaymentContextAfterOrder>();
  //   });
  // });
});
