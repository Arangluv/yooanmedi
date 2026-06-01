import { describe, it, expect } from 'vitest';
import { BaseError } from '@/shared';
import { UserMapper } from '../../mapper';
import { createUserResponseFixture } from '../fixtures';
import { userSchema, userListSchema } from '../../schemas';

describe('User Mappter', () => {
  describe('responseToUser', () => {
    it('Adapter Response가 User로 파싱된다', () => {
      // Given
      const responseResult = createUserResponseFixture();

      // When
      const result = UserMapper.responseToUser(responseResult);

      // Then
      expect(result).toEqual(expect.schemaMatching(userSchema));
    });

    it('Adapter Response에 프로퍼티가 추가되어도 User로 파싱된다', () => {
      // Given
      const responseResult = { ...createUserResponseFixture(), collections: 'users' };

      // When
      const result = UserMapper.responseToUser(responseResult);

      // Then
      expect(result).toEqual(expect.schemaMatching(userSchema));
    });

    it('파싱에 실패하는 경우 BaseError를 throw한다', () => {
      // Given
      const invalidData = { name: 'test-name' } as any;

      // When & Then
      expect(() => UserMapper.responseToUser(invalidData)).toThrow(BaseError);
    });
  });

  describe('responseToUserList', () => {
    it('Adapter Response가 User[]로 파싱된다', () => {
      // Given
      const responseResult = [
        createUserResponseFixture({ id: 1 }),
        createUserResponseFixture({ id: 2 }),
        createUserResponseFixture({ id: 3 }),
      ];

      // When
      const result = UserMapper.responseToUserList(responseResult);

      // Then
      expect(result).toEqual(expect.schemaMatching(userListSchema));
    });

    it('파싱에 실패하는 경우 BaseError를 throw한다', () => {
      // Given
      const invalidData = { name: 'test-name' } as any;

      // When & Then
      expect(() => UserMapper.responseToUserList(invalidData)).toThrow(BaseError);
    });
  });
});
