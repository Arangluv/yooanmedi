import { FindOption } from '@/shared';
import { UserAdapter } from '../api';
import { UserRepository } from '../../core';
import { UserMapper } from '../../mapper';
import { UpdateUserDto } from '../../dto';

export class UserApiRepository implements UserRepository {
  private adapter: ReturnType<typeof UserAdapter>;

  constructor(adapter: ReturnType<typeof UserAdapter>) {
    this.adapter = adapter;
  }

  public async findByHeader() {
    const result = await this.adapter.getUserByHeader();
    if (!result.ok) {
      throw result.error;
    }
    return UserMapper.responseToUser(result.data);
  }

  public async findById(id: number) {
    const result = await this.adapter.getUserById(id);
    if (!result.ok) {
      throw result.error;
    }
    return UserMapper.responseToUser(result.data);
  }

  public async findMany(option: FindOption) {
    const result = await this.adapter.getUserList(option);
    if (!result.ok) {
      throw result.error;
    }
    return UserMapper.responseToUserList(result.data);
  }

  public async update(dto: UpdateUserDto) {
    const result = await this.adapter.updateUser(dto);
    if (!result.ok) {
      throw result.error;
    }
    return UserMapper.responseToUser(result.data);
  }
}
