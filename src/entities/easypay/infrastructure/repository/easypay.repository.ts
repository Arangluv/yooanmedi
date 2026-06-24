import { EasyPayAdapter } from '../api';
import { EasyPayRepository } from '../../core';
import {
  EasyPayRegisterTransactionRequestDto,
  EasyPayApprovePaymentRequestDto,
  EasyPayPaymentCancelRequestDto,
} from '../../dto';
import { EasyPayMapper } from '../../mapper';

export class EasyPayApiRepository implements EasyPayRepository {
  private adapter: ReturnType<typeof EasyPayAdapter>;

  constructor(adapter: ReturnType<typeof EasyPayAdapter>) {
    this.adapter = adapter;
  }

  async registerTransaction(dto: EasyPayRegisterTransactionRequestDto) {
    const entity = EasyPayMapper.toRegistrationRequestEntity(dto);
    const response = await this.adapter.registerTransaction(entity);

    if (!response.ok) {
      throw response.error;
    }

    return response.data;
  }

  async approvePayment(dto: EasyPayApprovePaymentRequestDto) {
    const entity = EasyPayMapper.toApprovePaymentRequestEntity(dto);
    const response = await this.adapter.approvePayment(entity);

    if (!response.ok) {
      throw response.error;
    }

    return response.data;
  }

  async partialCancel(dto: EasyPayPaymentCancelRequestDto) {
    const entity = EasyPayMapper.toPartialCancelRequestEntity(dto);
    const response = await this.adapter.cancelPayment(entity);

    if (!response.ok) {
      throw response.error;
    }

    return response.data;
  }

  async totalCancel(dto: EasyPayPaymentCancelRequestDto) {
    const entity = EasyPayMapper.toTotalCancelRequestEntity(dto);
    const response = await this.adapter.cancelPayment(entity);

    if (!response.ok) {
      throw response.error;
    }

    return response.data;
  }
}
