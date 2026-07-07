import { FindOption } from '@/shared';
import { CartRepository } from '@/entities/cart';
import { CreateClientRequestDto, UserRepository } from '@/entities/user';
import { JoinUseCase } from '../usecases';
import { JoinUniqueCheckFieldDto } from '../dto';
import { JoinDuplicateFieldError } from '../libs';

export interface JoinServiceDependencies {
  repository: {
    cart: CartRepository;
    user: UserRepository;
  };
}

export const JoinService = ({ repository }: JoinServiceDependencies): JoinUseCase => ({
  clientJoin: async (dto: CreateClientRequestDto) => {
    const user = await repository.user.create(dto);
    await repository.cart.create({ user: user.id });
    return user;
  },

  checkDuplicateFileds: async (data: JoinUniqueCheckFieldDto[]) => {
    const result = await Promise.all(
      data.map(async ({ field, value, message }) => {
        const findOption: FindOption = {
          pagination: false,
          where: {
            [field]: {
              equals: value,
            },
          },
        };
        const users = await repository.user.findMany(findOption);

        return users.length === 0
          ? null
          : {
              field,
              message,
            };
      }),
    );

    return result.filter((r) => r !== null);
  },
});
