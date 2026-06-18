import { FindOption } from '@/shared';
import { PGTransitionOrderCommandDto, BankTransferTransitionOrderCommandDto } from '../../dto';

export const TransitionOrderFindOption = {
  orderProduct: {
    findMany: (
      commandDto: PGTransitionOrderCommandDto | BankTransferTransitionOrderCommandDto,
    ): FindOption => {
      return {
        pagination: false,
        where: {
          order: { equals: commandDto.order.id },
          orderProductStatus: { equals: commandDto.orderProductStatus.from },
        },
      };
    },
  },
};
