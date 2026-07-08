import { describe, it, expect } from 'vitest';
import { BaseError } from '@/shared';
import { UserMapper } from '../../mapper';
import { createUserEntityFixture } from '../fixtures';
import { userSchema, userListSchema } from '../../schemas';

describe('User Mappter', () => {
  describe('responseToUser', () => {
    it('Adapter Response가 User로 파싱된다', () => {
      // Given
      const responseResult = createUserEntityFixture();

      // When
      const result = UserMapper.responseToUser(responseResult);

      // Then
      expect(result).toEqual(expect.schemaMatching(userSchema));
    });

    it('Adapter Response에 프로퍼티가 추가되어도 User로 파싱된다', () => {
      // Given
      const responseResult = { ...createUserEntityFixture(), collections: 'users' };

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
        createUserEntityFixture({ id: 1 }),
        createUserEntityFixture({ id: 2 }),
        createUserEntityFixture({ id: 3 }),
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
