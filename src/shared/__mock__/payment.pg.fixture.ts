export const createPaymentRegisterFixture = () => {
  const formData = new FormData();

  formData.append('resCd', '0000');
  formData.append('resMsg', '정상');
  formData.append(
    'shopValue2',
    '[{"product":{"id":1685,"price":2000},"quantity":1},{"product":{"id":1684,"price":2000},"quantity":1},{"product":{"id":1683,"price":2000},"quantity":1}]',
  );
  formData.append('authorizationId', '26040311072910853257');
  formData.append('shopValue1', '');
  formData.append('shopValue4', '3');
  formData.append('shopValue3', '0');
  formData.append('shopValue6', '30000');
  formData.append('shopValue5', 'creditCard');
  formData.append('shopOrderNo', '202604035097221');

  return formData;
};

export const createPaymentRegisterFailureFixture = () => {
  const formData = new FormData();

  formData.append('resCd', '9999');
  formData.append('resMsg', '결제 등록에 실패했습니다');

  return formData;
};

export const basePaymentApprovalFixture = {
  resCd: '0000',
  resMsg: 'MPI결제 정상',
  mallId: '********',
  pgCno: '26040315293910853799',
  shopTransactionId: '**************',
  shopOrderNo: '202604037370977',
  amount: 6000,
  transactionDate: '20260403153020',
  statusCode: '****',
  statusMessage: '매입요청',
  msgAuthValue: '**************',
  escrowUsed: 'N',
  paymentInfo: {
    payMethodTypeCode: '11',
    approvalNo: '87858392',
    approvalDate: '20260403153020',
    cardInfo: {
      cardNo: '*****',
      issuerCode: '***',
      issuerName: 'TestCard',
      acquirerCode: '***',
      acquirerName: 'TestCard',
      installmentMonth: 0,
      freeInstallmentTypeCode: '00',
      cardGubun: 'N',
      cardBizGubun: 'P',
      partCancelUsed: 'Y',
      vanSno: '********',
      vanTid: '********',
      pntAmount: '0',
    },
  },
};

export const createPaymentApprovalFixture = (
  override?: Partial<typeof basePaymentApprovalFixture>,
) => {
  return {
    ...basePaymentApprovalFixture,
    ...override,
  };
};
