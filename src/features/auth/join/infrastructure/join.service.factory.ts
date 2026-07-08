import { UserAdapter, UserApiRepository } from '@/entities/user/infrastructure';
import { JoinService, JoinServiceDependencies } from './join.service';
import { CartAdapter, CartApiRepository } from '@/entities/cart/infrastructure';

export const createJoinUsecase = () => {
  const dependencies: JoinServiceDependencies = {
    repository: {
      user: new UserApiRepository(UserAdapter()),
      cart: new CartApiRepository(CartAdapter()),
    },
  };

  return JoinService(dependencies);
};
