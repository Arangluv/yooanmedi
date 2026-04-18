import {
  mallIdFixture,
  pgCnoFixture,
  shopOrderNoFixture,
  shopTransactionIdFixture,
} from '@/shared/__mock__/base.fixture';

export const TransactionRegistrationFixture = {
  requestDto: {
    amount: 6000,
    orderInfo: {
      goodsName: '소부날캡슐200mg 외 2개의 상품',
      customerInfo: {
        customerId: 'test0001',
        customerName: '인천병원',
        customerMail: 'test0001@gmail.com',
        customerContactNo: '01012345678',
        customerAddr: '인천 강화군 강화읍 갑곳리 1076-6 , 23026',
      },
    },
    shopValueInfo: {
      deliveryRequest: '배송 요청사항입니다',
      orderList: [
        {
          product: {
            id: 1681,
            price: 2000,
          },
          quantity: 1,
        },
        {
          product: {
            id: 1683,
            price: 2000,
          },
          quantity: 1,
        },
        {
          product: {
            id: 1684,
            price: 2000,
          },
          quantity: 1,
        },
      ],
      usedPoint: 0,
      userId: 3,
      minOrderPrice: 30000,
    },
  },
  invalidRequestDto: undefined as any,
  easypaySuccessResponse: {
    resCd: '0000',
    resMsg: 'ok',
    authPageUrl: 'https://www.testSite.com',
  },
  easypayFailureResponse: {
    resCd: '9999',
    resMsg: 'fail',
  },
  successResult: {
    isRegistrationSuccess: true,
    resCd: '0000',
    resMsg: 'ok',
    authPageUrl: 'https://www.testSite.com',
  },
  failureResult: {
    isRegistrationSuccess: false,
    resCd: '9999',
    resMsg: 'fail',
  },
} as const;

export const ValidateTransactionRegistrationResultFixture = {
  successRequestDto: {
    resCd: '0000',
    resMsg: '정상',
    authorizationId: '26041515173710881550',
    shopOrderNo: '202604159300512',
    shopValue1: '',
    shopValue2:
      '[{"product":{"id":1684,"price":2000},"quantity":1},{"product":{"id":1683,"price":2000},"quantity":1},{"product":{"id":1681,"price":2000},"quantity":1}]',
    shopValue3: '0',
    shopValue4: '3',
    shopValue5: 'creditCard',
    shopValue6: '30000',
  },
  failureRequestDto: {
    resCd: '9999',
    resMsg: '거래등록에 실패했습니다',
  },
  failureResult: {
    isRegistrationSuccess: false,
    resCd: '9999',
    resMsg: 'fail',
  },
};

export const PaymentApprovalFixture = {
  requestDto: {
    authorizationId: '12345678901234567890',
    shopOrderNo: '123456789012345',
  },
  invalidRequestDto: {
    authorizationId: '12345678901234567890',
  },
  successResult: {
    resCd: '0000',
    resMsg: 'test easypay success',
    isPaymentApprovalSuccess: true,
    mallId: mallIdFixture,
    pgCno: pgCnoFixture,
    shopOrderNo: shopOrderNoFixture,
    shopTransactionId: shopTransactionIdFixture,
    statusCode: 'TS03',
    statusMessage: '매입요청',
    msgAuthValue: '**************',
    escrowUsed: 'N',
    amount: 10000,
    transactionDate: '20260403153020',
    paymentInfo: {
      payMethodTypeCode: '11',
      approvalNo: '87858392',
      approvalDate: '20260403153020',
    },
  },
  failureResult: {
    resCd: '9999',
    resMsg: 'test easypay failure error',
    isPaymentApprovalSuccess: false,
  },
} as const;
