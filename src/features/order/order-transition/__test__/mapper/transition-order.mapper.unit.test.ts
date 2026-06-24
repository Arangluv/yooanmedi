import { describe, it, expect } from 'vitest';
import { PAYMENTS_METHOD } from '@/shared';
import { ORDER_STATUS } from '@/entities/order';
import { createOrderFixture } from '@/entities/order/__test__';
import { TransitionOrderMapper } from '../../mapper';
import { TransitionOrderScenarioResolver } from '../../core';
import { TransitionOrderCommandSchema } from '../../schemas';

describe('TransitionOrderMapper', () => {
  it('[toBankCommandDto] BankTransferTransitionOrderCommand Dto로 변환된다', () => {
    // Given
    const order = createOrderFixture({
      orderStatus: ORDER_STATUS.pending,
      paymentsMethod: PAYMENTS_METHOD.bank_transfer,
    });
    const scenario = TransitionOrderScenarioResolver.getTransitionScenarioForBankTransfer(order);

    // When
    const commandDto = TransitionOrderMapper.toBankCommandDto({ order, scenario });

    // Then
    expect(commandDto).toEqual(expect.schemaMatching(TransitionOrderCommandSchema.bank));
  });

  it('[toPGCommandDto] PGTransitionOrderCommand Dto로 변환된다', () => {
    // Given
    const order = createOrderFixture({
      orderStatus: ORDER_STATUS.preparing,
      paymentsMethod: PAYMENTS_METHOD.credit_card,
    });
    const scenario = TransitionOrderScenarioResolver.getTransitionScenarioForPG(order);

    // When
    const commandDto = TransitionOrderMapper.toPGCommandDto({ order, scenario });

    // Then
    expect(commandDto).toEqual(expect.schemaMatching(TransitionOrderCommandSchema.pg));
  });
});
