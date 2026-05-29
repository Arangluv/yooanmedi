import { FindOption } from '@/shared';
import { User } from '../types';

export interface UserRepository {
  findByHeader: () => Promise<User>;
  findById: (id: number) => Promise<User>;
  findMany: (option: FindOption) => Promise<User[]>;
  update: (data: any) => Promise<any>;
}
