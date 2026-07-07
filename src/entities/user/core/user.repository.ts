import { FindOption } from '@/shared';
import { User } from '../types';
import { CreateClientRequestDto, UpdateUserDto } from '../dto';

export interface UserRepository {
  findByHeader: () => Promise<User>;
  findById: (id: number) => Promise<User>;
  findMany: (option: FindOption) => Promise<User[]>;
  update: (dto: UpdateUserDto) => Promise<User>;
  create: (dto: CreateClientRequestDto) => Promise<User>;
}
