import { FindOption } from '@/shared';
import { User, UserWithHiddenField } from '../types';
import { CreateClientRequestDto, UpdateUserDto } from '../dto';

export interface UserRepository {
  findByHeader: () => Promise<User>;
  findById: (id: number) => Promise<User>;
  findWithHiddenField: (id: number) => Promise<UserWithHiddenField>;
  findMany: (option: FindOption) => Promise<User[]>;
  update: (dto: UpdateUserDto) => Promise<User>;
  create: (dto: CreateClientRequestDto) => Promise<User>;
}
