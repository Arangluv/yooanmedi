import { describe, it, expect } from 'vitest';
import { EasyPayFixtures } from '../fixtures';
import { EasyPayMapper } from '../../mapper';
import {
  EasyPayRegistrationSchemas,
  EasyPayPaymentApprovalSchemas,
  EasyPayPaymentCancelSchemas,
} from '../../schemas';
import { EASYPAY_CONFIG } from '@/shared';

describe('EasyPayMapper', () => {
  it('[toRegistrationRequestEntity] requestDto가 requestEntity로 파싱된다', () => {
    // Given
    const dto = EasyPayFixtures.dto.register;

    // When
    const result = EasyPayMapper.toRegistrationRequestEntity(dto);

    // Then
    expect(result).toEqual(expect.schemaMatching(EasyPayRegistrationSchemas.requestEntity));
  });

  it('[toApprovePaymentRequestEntity] requestDto가 requestEntity로 파싱된다', () => {
    // Given
    const dto = EasyPayFixtures.dto.approve;

    // When
    const result = EasyPayMapper.toApprovePaymentRequestEntity(dto);

    // Then
    expect(result).toEqual(expect.schemaMatching(EasyPayPaymentApprovalSchemas.requestEntity));
  });

  it('[toPartialCancelRequestEntity] requestDto가 requestEntity로 파싱된다', () => {
    // Given
    const dto = EasyPayFixtures.dto.cancel;

    // When
    const result = EasyPayMapper.toPartialCancelRequestEntity(dto);

    // Then
    expect(result.reviseTypeCode).toBe(EASYPAY_CONFIG.cancelReviseType.partial);
    expect(result).toEqual(expect.schemaMatching(EasyPayPaymentCancelSchemas.requestEntity));
  });

  it('[toTotalCancelRequestEntity] requestDto가 requestEntity로 파싱된다', () => {
    // Given
    const dto = EasyPayFixtures.dto.cancel;

    // When
    const result = EasyPayMapper.toTotalCancelRequestEntity(dto);

    // Then
    expect(result.reviseTypeCode).toBe(EASYPAY_CONFIG.cancelReviseType.total);
    expect(result).toEqual(expect.schemaMatching(EasyPayPaymentCancelSchemas.requestEntity));
  });

  it('[toRegistrationResult] response가 result로 파싱된다', () => {
    // Given
    const response = EasyPayFixtures.easyPayResponse.register;

    // When
    const result = EasyPayMapper.toRegistrationResult(response);

    // Then
    expect(result).toEqual(expect.schemaMatching(EasyPayRegistrationSchemas.result));
  });

  it('[toApprovalResult] response가 result로 파싱된다', () => {
    // Given
    const response = EasyPayFixtures.easyPayResponse.approve;

    // When
    const result = EasyPayMapper.toApprovalResult(response);

    // Then
    expect(result).toEqual(expect.schemaMatching(EasyPayPaymentApprovalSchemas.result));
  });

  it('[toCancelResult] response가 result로 파싱된다', () => {
    // Given
    const response = EasyPayFixtures.easyPayResponse.cancel;

    // When
    const result = EasyPayMapper.toCancelResult(response);

    // Then
    expect(result).toEqual(expect.schemaMatching(EasyPayPaymentCancelSchemas.result));
  });
});
