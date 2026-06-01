import { FindOption } from '@/shared';
import { User } from '../types';
import { UpdateUserDto } from '../dto';

export interface UserRepository {
  findByHeader: () => Promise<User>;
  findById: (id: number) => Promise<User>;
  findMany: (option: FindOption) => Promise<User[]>;
  update: (data: UpdateUserDto) => Promise<User>;
}
