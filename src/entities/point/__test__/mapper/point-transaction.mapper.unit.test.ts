import { describe, it, expect } from 'vitest';
import { PointTransactionFixtures } from '../fixtures';
import { PointTransactionMapper } from '../../mapper';
import {
  CreateCancelEarnPointHistoryRequestDto,
  CreateCancelUsePointHistoryRequestDto,
  CreateEarnPointHistoryRequestDto,
  CreateUsePointHistoryRequestDto,
} from '../../dto';
import { createPointTransactionEntitySchema, userReferenceSchema } from '../../schemas';
import { POINT_ACTION } from '../../constants';
import { UserReference } from '../../types';

describe('Point Trasction Mapper', () => {
  it('payload response가 domain 객체로 파싱된다', () => {
    // Given
    const adapterResponse = PointTransactionFixtures.valid.basic;

    // When
    const result = PointTransactionMapper.responseToDomain(adapterResponse);

    // Then
    expect(result).toBeDefined();
    expect(result).toMatchObject(PointTransactionFixtures.valid.basic);
  });

  it('CreateUseRequestDto가 CreateEntity로 파싱된다', () => {
    // Given
    const dto = {
      user: 1,
      orderProduct: 3,
      amount: 100,
    } as CreateUsePointHistoryRequestDto;

    // When
    const result = PointTransactionMapper.toUsePointHistoryEntity(dto);

    // Then
    expect(result).toEqual(expect.schemaMatching(createPointTransactionEntitySchema));
    expect(result.type).toBe(POINT_ACTION.use);
  });

  it('CreateEarnRequestDto가 CreateEntity로 파싱된다', () => {
    // Given
    const dto = {
      user: 1,
      orderProduct: 3,
      amount: 100,
    } as CreateEarnPointHistoryRequestDto;

    // When
    const result = PointTransactionMapper.toEarnPointHistoryEntity(dto);

    // Then
    expect(result).toEqual(expect.schemaMatching(createPointTransactionEntitySchema));
    expect(result.type).toBe(POINT_ACTION.earn);
  });

  it('CreateCancelUseRequestDto가 CreateEntity로 파싱된다', () => {
    // Given
    const dto = {
      user: 1,
      orderProduct: 3,
    } as CreateCancelUsePointHistoryRequestDto;
    const amount = 100;

    // When
    const result = PointTransactionMapper.toCancelUsePointHistoryEntity(dto, amount);

    // Then
    expect(result).toEqual(expect.schemaMatching(createPointTransactionEntitySchema));
    expect(result.type).toBe(POINT_ACTION.cancel_use);
  });

  it('CreateCancelEarnRequestDto가 CreateEntity로 파싱된다', () => {
    // Given
    const dto = {
      user: 1,
      orderProduct: 3,
    } as CreateCancelEarnPointHistoryRequestDto;
    const amount = 100;

    // When
    const result = PointTransactionMapper.toCancelEarnPointHistoryEntity(dto, amount);

    // Then
    expect(result).toEqual(expect.schemaMatching(createPointTransactionEntitySchema));
    expect(result.type).toBe(POINT_ACTION.cancel_earn);
  });

  it('UserReference가 파싱된다', () => {
    // Given
    const user = {
      id: 1,
      point: 100,
    } as UserReference;

    // When
    const result = PointTransactionMapper.toUserReference(user);

    //Then
    expect(result).toEqual(expect.schemaMatching(userReferenceSchema));
    expect(result).toMatchObject(user);
  });

  it.todo('product entity refactoring 후 fixture에서 가져와서 테스트 코드를 작성한다');

  it.todo('cart entity refactoring 후 fixture에서 가져와서 테스트 코드를 작성한다');
});
