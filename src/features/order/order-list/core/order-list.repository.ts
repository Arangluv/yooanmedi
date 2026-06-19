import { FindOption } from '@/shared';

export interface OrderListRepository {
  findMandForAdmin: (option: FindOption) => Promise<any>;

  findMandForClient: (option: FindOption) => Promise<any>;
}
