import { describe, it, expect, beforeEach, vi } from 'vitest';
import { TestErrorHelper, BaseError, FindOption } from '@/shared';
import { PayloadAdapterResultManager } from '@/shared/server';
import { MockUserAdapter } from '../mocks';
import { createUserEntityFixture } from '../fixtures';
import { UserApiRepository } from '../../infrastructure';
import { userSchema } from '../../schemas';
import { UpdateUserDto } from '../../dto';

describe('User Api Repository', () => {
  let userApiRepository: UserApiRepository;
  let mockUserAdapter: ReturnType<typeof MockUserAdapter>;

  beforeEach(() => {
    mockUserAdapter = MockUserAdapter();
    userApiRepository = new UserApiRepository(mockUserAdapter);
  });

  describe('getUserByHeader', () => {
    it('유저 정보를 가져오는데 성공한다', async () => {
      // Given
      vi.mocked(mockUserAdapter.getUserByHeader).mockResolvedValue(
        PayloadAdapterResultManager.ok({
          ...createUserEntityFixture(),
          collection: 'users',
        }),
      );

      // When
      const result = await userApiRepository.findByHeader();

      // Then
      expect(result).toBeDefined();
      expect(result).toEqual(expect.schemaMatching(userSchema));
    });

    it('유저 정보를 가져오는데 실패하면 BaseError를 throw한다', async () => {
      // Given
      vi.mocked(mockUserAdapter.getUserByHeader).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => userApiRepository.findByHeader()).rejects.toThrow(BaseError);
    });
  });

  describe('findById', () => {
    it('유저 정보를 가져오는데 성공한다', async () => {
      // Given
      const targetUserId = 3;
      vi.mocked(mockUserAdapter.getUserById).mockResolvedValue(
        PayloadAdapterResultManager.ok(createUserEntityFixture()),
      );

      // When
      const result = await userApiRepository.findById(targetUserId);

      // Then
      expect(result).toBeDefined();
      expect(result).toEqual(expect.schemaMatching(userSchema));
    });

    it('유저 정보를 가져오는데 실패하면 BaseError를 throw한다', async () => {
      // Given
      const targetUserId = 3;
      vi.mocked(mockUserAdapter.getUserById).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => userApiRepository.findById(targetUserId)).rejects.toThrow(BaseError);
    });
  });

  describe('findMany', () => {
    it('유저 리스트를 가져오는데 성공한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(
        mockUserAdapter.getUserList.mockResolvedValue(
          PayloadAdapterResultManager.ok([
            createUserEntityFixture({ id: 1 }),
            createUserEntityFixture({ id: 2 }),
          ]),
        ),
      );
      // When
      const result = await userApiRepository.findMany(option);

      // Then
      expect(result).instanceOf(Array);
      expect(result.length).toBe(2);
      expect(result[0]).toEqual(expect.schemaMatching(userSchema));
    });

    it('User Adapter의 data가 빈 배열인 경우, 빈 배열을 반환한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(mockUserAdapter.getUserList.mockResolvedValue(PayloadAdapterResultManager.ok([])));

      // When
      const result = await userApiRepository.findMany(option);

      // Then
      expect(result).instanceOf(Array);
      expect(result.length).toBe(0);
    });

    it('유저 리스트를 가져오는데 실패하면 BaseError를 throw한다', async () => {
      // Given
      const option = {} as FindOption;
      vi.mocked(mockUserAdapter.getUserList).mockResolvedValue(
        PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
      );

      // When & Then
      await expect(() => userApiRepository.findMany(option)).rejects.toThrow(BaseError);
    });
  });

  describe('updateUser', () => {
    it('유저 업데이트에 성공하고, 유저를 반환한다', async () => {
      // Given
      const updateDto = {
        user: 3,
        data: {
          point: 300,
        },
      } as UpdateUserDto;
      vi.mocked(
        mockUserAdapter.updateUser.mockResolvedValue(
          PayloadAdapterResultManager.ok(createUserEntityFixture()),
        ),
      );

      // When
      const result = await userApiRepository.update(updateDto);

      // Then
      expect(result).toBeDefined();
      expect(result).toEqual(expect.schemaMatching(userSchema));
    });

    it('유저 업데이트에 실패하면 BaseError를 throw한다', async () => {
      // Given
      const updateDto = {
        user: 3,
        data: {
          point: 300,
        },
      } as UpdateUserDto;
      vi.mocked(
        mockUserAdapter.updateUser.mockResolvedValue(
          PayloadAdapterResultManager.fail(TestErrorHelper.generateAdapterError()),
        ),
      );

      // When & Then
      await expect(() => userApiRepository.update(updateDto)).rejects.toThrow(BaseError);
    });
  });
});
