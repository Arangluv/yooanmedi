import { PAYMENTS_METHOD } from '@/shared';
import {
  EasyPayRegisterTransactionRequestDto,
  EasyPayApprovePaymentRequestDto,
  EasyPayPaymentCancelRequestDto,
} from '../../dto';
import {
  EasyPayRegisterTransactionApiSuccessResponse,
  EasyPayPaymentApprovalApiSuccessResponse,
  EasyPayPaymentCancelApiSuccessResponse,
  EasyPayPaymentAuthenticationResponse,
  // result
  EasyPayRegisterTransactionResult,
  EasyPayPaymentApprovalResult,
  EasyPayPaymentCancelResult,
} from '../../types';
import { EasyPayFixtureUtil } from './easypay.fixture.util';

export const EasyPayFixtures = {
  dto: {
    register: {
      amount: 12000,
      orderInfo: {
        goodsName: '테스트 상품',
        customerInfo: {
          customerId: 'testId',
          customerName: '테스트유저',
          customerMail: 'test@gmail.com',
          customerAddr: '테스트 주소',
          customerContactNo: '01000000000',
        },
      },
      shopValueInfo: {
        deliveryRequest: '',
        orderList: [{ product: { id: 1, price: 2000 }, quantity: 3 }],
        usedPoint: 0,
        userId: 3,
        minOrderPrice: 30000,
      },
    } as EasyPayRegisterTransactionRequestDto,

    approve: {
      authorizationId: EasyPayFixtureUtil.generateAuthorizationId(),
      shopOrderNo: EasyPayFixtureUtil.generateShopOrderNo(),
    } as EasyPayApprovePaymentRequestDto,

    cancel: {
      pgCno: EasyPayFixtureUtil.generatePgCno(),
      amount: 32000,
    } as EasyPayPaymentCancelRequestDto,
  },

  easyPayResponse: {
    register: {
      resCd: '0000',
      resMsg: '성공',
      authPageUrl: 'http://testurl.com',
    } as EasyPayRegisterTransactionApiSuccessResponse,

    auth: {
      authorizationId: EasyPayFixtureUtil.generateAuthorizationId(),
      shopOrderNo: EasyPayFixtureUtil.generateShopOrderNo(),
      shopValue1: '테스트요청사항',
      shopValue2:
        '[{"product":{"id":1684,"price":2000},"quantity":1},{"product":{"id":1683,"price":2000},"quantity":1},{"product":{"id":1681,"price":2000},"quantity":1}]',
      shopValue3: '1000', // usedPoint
      shopValue4: '3', // userId,
      shopValue5: PAYMENTS_METHOD.credit_card,
      shopValue6: '30000', // minOrderPrice
    } as EasyPayPaymentAuthenticationResponse,

    approve: {
      resCd: '0000',
      resMsg: '성공',
      mallId: EasyPayFixtureUtil.generateMID(),
      pgCno: EasyPayFixtureUtil.generatePgCno(),
      shopOrderNo: EasyPayFixtureUtil.generateShopOrderNo(),
      shopTransactionId: EasyPayFixtureUtil.generateShopTransactionId(),
      statusCode: 'TS03',
      statusMessage: '매입요청',
      msgAuthValue: '**************',
      escrowUsed: 'N',
      amount: 13000,
      transactionDate: '20260403153020',
      paymentInfo: {
        payMethodTypeCode: '11',
        approvalNo: '87858392',
        approvalDate: '20260403153020',
      },
    } as EasyPayPaymentApprovalApiSuccessResponse,

    cancel: {
      resCd: '0000',
      resMsg: '성공',
      cancelPgCno: EasyPayFixtureUtil.generatePgCno(),
    } as EasyPayPaymentCancelApiSuccessResponse,
  },

  result: {
    register: {
      authPageUrl: 'https://test-url.com',
    } as EasyPayRegisterTransactionResult,

    approve: {
      mallId: EasyPayFixtureUtil.generateMID(),
      pgCno: EasyPayFixtureUtil.generatePgCno(),
      shopOrderNo: EasyPayFixtureUtil.generateShopOrderNo(),
      shopTransactionId: EasyPayFixtureUtil.generateShopTransactionId(),
      statusCode: 'TS03',
      statusMessage: '매입요청',
      msgAuthValue: '**************',
      escrowUsed: 'N',
      amount: 77588,
      transactionDate: '20260403153020',
      paymentInfo: {
        payMethodTypeCode: '11',
        approvalNo: '87858392',
        approvalDate: '20260403153020',
      },
    } as EasyPayPaymentApprovalResult,

    cancel: {
      cancelPgCno: EasyPayFixtureUtil.generatePgCno(),
    } as EasyPayPaymentCancelResult,
  },
};
